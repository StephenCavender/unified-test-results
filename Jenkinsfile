node('ait') {
  try {
    checkout scm
    stage('Build') {
      docker.image('node:10').inside('--network=host') {
        sh 'npm install && npm run build'
      }
    }

    stage('Deploy') {
      if (currentBuild.result == null || currentBuild.result == 'SUCCESS') {
        name = 'unified-test-results'
        sh "docker container stop $name || true"
        docker.build("$name").run("--name $name -p 80:80")
      }
    }
  } finally {
      cleanWs()
  }
}
