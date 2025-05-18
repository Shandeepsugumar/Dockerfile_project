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
                sh '''
                   # Use Minikube's Docker daemon
                   eval $(minikube -p minikube docker-env)

                   # Build the Docker image inside Minikube's Docker
                   docker build -t my-app:v7 .

                   # Load the image into Minikube (optional but safer)
                   minikube image load my-app:v7
                '''
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
