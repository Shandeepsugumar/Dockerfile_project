pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-app"
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {
        stage('Clone Code') {
            steps {
                git url: 'https://github.com/Shandeepsugumar/Dockerfile_project.git', branch: 'main'
            }
        }

        stage('Setup Docker Env for Minikube') {
            steps {
                sh 'eval $(minikube docker-env)'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Update K8s YAML') {
            steps {
                sh "sed -i 's|IMAGE_NAME|${IMAGE_NAME}:${IMAGE_TAG}|g' deployment.yaml"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get svc'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed.'
        }
    }
}
