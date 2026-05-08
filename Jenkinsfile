pipeline {
    agent any

    environment {
        IMAGE_NAME = "youtube-clone-app"
        CONTAINER_NAME = "youtube-container"
        PORT = "8091"
        SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Pratik-0410/Youtube-clone-main'
            }
        }

        stage('Check Docker Access') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Clean Old Images') {
            steps {
                sh 'docker image prune -f'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                    -Dsonar.projectKey=youtube-clone \
                    -Dsonar.projectName=youtube-clone \
                    -Dsonar.sources=src
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'RAPID_API_KEY', variable: 'API_KEY')]) {
                    sh """
                    docker build -t ${IMAGE_NAME}:latest \
                    --build-arg REACT_APP_RAPID_API_KEY=${API_KEY} .
                    """
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh "trivy image ${IMAGE_NAME}:latest"
            }
        }

        stage('Run Docker Container') {
            steps {
                sh """
                docker rm -f ${CONTAINER_NAME} || true
                docker run -d \
                -p ${PORT}:3000 \
                --name ${CONTAINER_NAME} \
                ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f deployment.yml --validate=false'
                sh 'kubectl apply -f service.yml --validate=false'
                sh 'kubectl rollout status deployment/youtube-deployment --timeout=120s'
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get svc'
                sh 'kubectl get deployment'
            }
        }
    }

    post {
        success {
            echo 'Pipeline Executed Successfully'
        }
        failure {
            echo 'Pipeline Failed'
        }
    }
}
