node('ait') {
    try {
        stage('Build') {
            git 'https://github.com/akauffmanGG/unified-test-results.git'
            sh 'npm install && npm run build'
            stash includes: 'dist/,Dockerfile', name: 'app'
        }
        stage('Containerize') {
            name = 'unified-test-results'
            dir("$name") {
                unstash name: 'app'
                sh "docker container stop $name"
                docker.build("$name").run("--name $name -p 8080:80")
           }
        }
    } finally {
        cleanWs()
    }
}
