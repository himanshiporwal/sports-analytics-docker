pipeline {
  agent any

  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    DOCKER_USER = "${DOCKERHUB_CREDS_USR}"
    DOCKER_PASS = "${DOCKERHUB_CREDS_PSW}"
    BACKEND_IMAGE = "himanshi1409/sports-backend:latest"
    FRONTEND_IMAGE = "himanshi1409/sports-frontend:latest"
  }

  stages {
    stage('Checkout Code') {
      steps {
        git branch: 'main', url: 'https://github.com/himanshiporwal/sports-analytics-docker.git'
      }
    }

    stage('Docker Login') {
      steps {
        sh """
          echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
        """
      }
    }

    stage('Build Backend Image') {
      steps {
        sh "docker build -t $BACKEND_IMAGE ./backend"
      }
    }

    stage('Build Frontend Image') {
      steps {
        sh "docker build -t $FRONTEND_IMAGE ./frontend"
      }
    }

    stage('Push Images to DockerHub') {
      steps {
        sh """
          docker push $BACKEND_IMAGE
          docker push $FRONTEND_IMAGE
        """
      }
    }
  }

  post {
    always {
      sh "docker logout || true"
    }
    success {
      echo "✅ CI/CD Completed: Images built & pushed to DockerHub"
    }
    failure {
      echo "❌ Pipeline Failed. Check console logs."
    }
  }
}
