node('ait') {
  try {
    checkout scm
    stage('Build') {
      docker.image('node:10').inside {
        sh '''
          sysctl -w net.ipv4.ip_forward=1 || true
          npm install && npm run build
        '''
      }
    }

    stage('Deploy') {
      if (currentBuild.result == null || currentBuild.result == 'SUCCESS') {
        name = 'unified-test-results'
        sh "docker container stop $name"
        docker.build("$name").run("--name $name -p 8080:80")
      }
    }
  } finally {
      cleanWs()
  }
}
