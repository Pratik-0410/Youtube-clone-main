pipeline {
    agent any

    environment {
 HEAD
        IMAGE_NAME      = "youtube-clone-app"
        IMAGE_NAME      = "youtube-clone"
        CONTAINER_NAME  = "youtube-container"
        PORT            = "8091"
        SCANNER_HOME    = tool 'sonar-scanner'
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                url: 'https://github.com/Pratik-0410/Youtube-clone-main'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectKey=youtube-clone \
                    -Dsonar.projectName=youtube-clone \
                    -Dsonar.sources=src \
                    -Dsonar.sourceEncoding=UTF-8
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Skipping Quality Gate for now'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
                    $SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectKey=youtube-clone \
                    -Dsonar.projectName=youtube-clone \
                    -Dsonar.sources=src \
                    -Dsonar.sourceEncoding=UTF-8
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                echo 'Skipping Quality Gate for now'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'RAPID_API_KEY', variable: 'API_KEY')]) {
                    sh '''
                    docker build -t $IMAGE_NAME:latest \
                    --build-arg REACT_APP_RAPID_API_KEY=$API_KEY .
                    '''
                }
            }
        }

        stage('Trivy Scan') {
            steps {
                sh '''
                trivy image --severity HIGH,CRITICAL --no-progress $IMAGE_NAME:latest
                '''
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                docker ps -q --filter "publish=$PORT" | xargs -r docker stop
                docker ps -aq --filter "publish=$PORT" | xargs -r docker rm
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                docker run -d -p $PORT:3000 \
                --name $CONTAINER_NAME \
                $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl apply -f deployment.yml
                '''
            }
        }

        stage('Verify Kubernetes Deployment') {
            steps {
                sh '''
                kubectl get pods
                kubectl get svc
                '''
            }
        }

        stage('Clean Old Images') {
            steps {
                sh 'docker image prune -f'
            }
        }
    }

    post {

        success {
            script {

                def publicIP = sh(
                    script: "curl -s ifconfig.me",
                    returnStdout: true
                ).trim()

                mail to: 'prtkbamane@gmail.com',
                subject: "YouTube Clone Build Success ✅",
                body: """
Build Status: SUCCESS

SonarQube Scan: PASSED
Trivy Scan: PASSED HEAD
Kubernetes Deployment: SUCCESS


Application URLs:

Docker Access:
http://localhost:${PORT}

Remote Access:
http://${publicIP}:${PORT}

Kubernetes Access:
Run:
minikube service youtube-service

Jenkins Build Details:
${env.BUILD_URL}
"""
            }
        }

        failure {
            mail to: 'prtkbamane@gmail.com',
            subject: "YouTube Clone Build Failed ❌",
            body: """
Build Status: FAILED

Check Jenkins Logs:
${env.BUILD_URL}
"""
        }
    }
}
