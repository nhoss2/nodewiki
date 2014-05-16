#Node Wiki

A simple git based wiki system for markdown files written in node.js.

[![screenshot](https://raw.github.com/nhoss2/nodewiki/d02b3596876d712f839f027204f6c488c8d90f42/static/screenshot.jpg)](http://github.com/nhoss2/nodewiki)
##What it does

This is a simple wiki system that uses markdown (text) files as its
database. It reads and writes to the text files in the directory it was
started in so it is possible to use text editors to edit the files.
Version control is done through git. There is a git mode which
automatically does a git commit on each file save.

## Install

    npm install nodewiki -g

*note: you may need sudo*


## Usage

    nodewiki

Node Wiki can be started on any directory. To start it, simply type
`nodewiki` in the directory that you want to start it in. Without any
options, the URL for node wiki would be: http://<Hostname_or_IP>:3000/
and any other computer on the network can access the wiki (subject to
firewall settings). To specify the port set the environment varialbe `PORT`.

###Examples

`nodewiki`  
Starts node wiki

```
SET PORT 8888
nodewiki
```
Starts node wiki on port 8888
