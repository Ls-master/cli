#! /bin/sh
sprint=$1
user=$2
git checkout "feature-${sprint}"
if [ $? == 1 ]
then
    exit
fi
echo "git checkout feature-${sprint}\r\n"
git pull
echo "git pull"
git checkout "feature-${sprint}-${user}"
echo "git checkout feature-${sprint}-${user}\r\n"
git merge "feature-${sprint}"
if [ $? == 1 ]
then
    exit
fi
echo "git merge feature-${sprint}\r\n"
git push
echo "git push"