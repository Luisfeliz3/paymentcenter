pipeline {
  agent any
  options {
    skipDefaultCheckout()
    disableConcurrentBuilds()
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
  }
  parameters {
    string(name: 'MONGOD_BIN', defaultValue: '/Volumes/lefty/mongodb/bin/mongod',
      description: 'MongoDB executable on the Jenkins agent. Use an absolute path if needed.')
  }
  stages {
    stage('Checkout') {
      steps {
        deleteDir()
        checkout scm
      }
    }
    stage('Build') {
      steps {
        sh 'node --version && bash ci/build.sh'
      }
    }
    stage('Deploy to QA and verify') {
      steps {
        sh 'bash ci/verify.sh'
      }
    }
  }
  post {
    always {
      junit testResults: 'qa/test-results/junit.xml', allowEmptyResults: true
      archiveArtifacts artifacts: 'qa/playwright-report/**,qa/test-results/**,ci-logs/**', allowEmptyArchive: true
    }
    success {
      archiveArtifacts artifacts: 'client/build/**', fingerprint: true
    }
  }
}
