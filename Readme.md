#Node Wiki


A simple git based wiki system for [markdown]() files written in [node.js]()

[screenshot here]

##What it does

This is a simple wiki system that uses markdown (text) files as its database. You start it in a directory and it starts a server which can edit existing files and create new ones. It is all organised through folders. You can edit files normally through a text editor or you can use this...

Version control is done through git.

There is a git mode which automatically does a git commit on each file save.

##install

    npm install nodewiki -g

*note: you may need sudo*

##Usage

    nodewiki [option] [port]

Node Wiki can be started on any directory. To start it, simply type `nodewiki` in the directory that you want to start it in. Node wiki will start on your server on port 8888 (unless you type `nodewiki PORTNUMBER_HERE`).

###Commands

- `nodewiki` - Starts node wiki

- `nodewiki git` starts node wiki in git mode

- `nodewiki help` displays node wiki usage.