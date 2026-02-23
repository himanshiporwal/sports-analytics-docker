pipeline {
  agent any

  environment {
    DOCKERHUB_USER = 'himanshi1409'
    BACKEND_IMAGE  = "${DOCKERHUB_USER}/sports-backend:latest"
    FRONTEND_IMAGE = "${DOCKERHUB_USER}/sports-frontend:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker --version'
        sh "docker build -t ${BACKEND_IMAGE} ./backend"
        sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DH_USER', passwordVariable: 'DH_PASS')]) {
          sh 'echo "$DH_PASS" | docker login -u "$DH_USER" --password-stdin'
          sh "docker push ${BACKEND_IMAGE}"
          sh "docker push ${FRONTEND_IMAGE}"
        }
      }
    }
  }

  post {
    success { echo "✅ CI/CD Done: Images built & pushed to DockerHub" }
    failure { echo "❌ Pipeline Failed" }
  }
}