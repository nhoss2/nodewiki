#Node Wiki


A simple git based wiki system for markdown files written in node.js.

[![screenshot](https://raw.github.com/nhoss2/nodewiki/d02b3596876d712f839f027204f6c488c8d90f42/static/screenshot.jpg)](http://github.com/nhoss2/nodewiki)
##What it does

This is a simple wiki system that uses markdown (text) files as its database. It reads and writes to the text files in the directory it was started in so it is possible to use text editors to edit the files. Version control is done through git. There is a git mode which automatically does a git commit on each file save.

##install

    npm install nodewiki -g

*note: you may need sudo*

##Usage

    nodewiki <command> [port]

Node Wiki can be started on any directory. To start it, simply type `nodewiki` in the directory that you want to start it in. Node wiki will start on port 8888 (unless you type `nodewiki PORTNUMBER_HERE`).

###Commands

- `nodewiki` - Starts node wiki

- `nodewiki git` starts node wiki in git mode

- `nodewiki help` displays node wiki usage.