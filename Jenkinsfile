pipeline {
    agent any

    tools {
        nodejs 'frontend-nodejs'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Environment') {
            steps {
                sh '''
                    test -n "$VITE_API_AUTH_URL"    || (echo "VITE_API_AUTH_URL is required."    && exit 1)
                    test -n "$VITE_API_CORE_URL"    || (echo "VITE_API_CORE_URL is required."    && exit 1)
                    test -n "$VITE_API_PAYMENT_URL" || (echo "VITE_API_PAYMENT_URL is required." && exit 1)
                    test -n "$VITE_API_SHOP_URL"    || (echo "VITE_API_SHOP_URL is required."    && exit 1)
                    test -n "$VITE_API_CART_URL"    || (echo "VITE_API_CART_URL is required."    && exit 1)
                    test -n "$FRONTEND_S3_BUCKET"   || (echo "FRONTEND_S3_BUCKET is required."   && exit 1)
                    test -n "$FRONTEND_S3_PREFIX"   || (echo "FRONTEND_S3_PREFIX is required."   && exit 1)
                    test -n "$AWS_CREDENTIALS_ID"   || (echo "AWS_CREDENTIALS_ID is required."   && exit 1)
                    test -n "$AWS_DEFAULT_REGION"   || (echo "AWS_DEFAULT_REGION is required."   && exit 1)

                    DEPLOY_PREFIX="${FRONTEND_S3_PREFIX%/}"
                    test -n "$DEPLOY_PREFIX" || (echo "FRONTEND_S3_PREFIX must not point to the bucket root." && exit 1)

                    case "$DEPLOY_PREFIX" in
                        /*|"."|"..")
                            echo "FRONTEND_S3_PREFIX must be a non-root relative S3 prefix."
                            exit 1
                            ;;
                    esac
                '''
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: env.AWS_CREDENTIALS_ID,
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh '''
                        DEPLOY_PREFIX="${FRONTEND_S3_PREFIX%/}"
                        aws s3 sync dist/ "s3://$FRONTEND_S3_BUCKET/$DEPLOY_PREFIX/" --delete
                    '''
                }
            }
        }

        stage('Invalidate CloudFront') {
            when {
                expression { env.CLOUDFRONT_DISTRIBUTION_ID?.trim() }
            }
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: env.AWS_CREDENTIALS_ID,
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    sh 'aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"'
                }
            }
        }
    }
}
