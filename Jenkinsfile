pipeline {
    agent any

    tools {
        nodejs 'frontend-nodejs'
    }

    environment {
        // s3 버킷 이름
        S3_BUCKET = "kkpp-s3-bucket"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                // Vite 전용 리액트 빌드 스크립트 
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding', 
                    credentialsId: 'aws-s3-frontend-deploy', 
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                ]]) {
                    // vite 기반 리액트 앱은 build/ 가 아니라 dist/ 폴더를 동기화
                    sh 'aws s3 sync dist/ s3://${S3_BUCKET} --delete'
                }
            }
        }
    }
}
