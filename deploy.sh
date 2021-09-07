#!/usr/bin/env sh

# abort on errors
set -e

# build
git checkout master
npm run prod


# git init
git add -A
git commit -m "deploy - ${date}"

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push production main

git checkout main

cd -
