pipeline {
    agent any

    environment {
        IMAGE_NAME = "youtube-clone"
        CONTAINER_NAME = "youtube-container"
        PORT = "8091"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Pratik-0410/Youtube-clone-main'
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

        stage('Stop & Remove Old Container') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
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

        stage('Clean Old Images') {
            steps {
                sh '''
                docker image prune -f
                '''
            }
        }
    }

    post {

        success {
    mail to: 'prtkbamane@gmail.com',
         subject: "YouTube Clone Build Success ✅",
         body: """
Build Status: SUCCESS

App is running at:
http://13.62.20.65:${PORT}

Jenkins Build:
${env.BUILD_URL}
"""
}

        failure {
            mail to: 'prtkbamane@gmail.com',
                 subject: "YouTube Clone Build Failed ❌",
                 body: """
Build Status: FAILED

Check logs:
${env.BUILD_URL}
"""
        }
    }
}
