node('ait') {
  try {
    stage('Build') {
      sh 'echo "FROM node:10" > Dockerfile.build'
      docker.build('build', '-f Dockerfile.build').inside() {
        sh 'npm install && npm run build'
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
