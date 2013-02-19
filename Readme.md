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

    nodewiki [options]

Node Wiki can be started on any directory. To start it, simply type
`nodewiki` in the directory that you want to start it in. Without any
options, the URL for node wiki would be: http://<Hostname_or_IP>:8888/
and any other computer on the network can access the wiki (subject to
firewall settings).

If you do not want other computers to be able to access node wiki, then
use `--local` or `--port=127.0.0.1`. The URL for node wiki will then be
http://localhost:8888/.

If your computer is connected to a network, then the `--local` option is
highly recommended.


###Options
`-a <IPv4_addr>`  
`--addr=<IPv4_addr>`  
`--addr <IPv4_addr>`  
> Listen only on IPv4_addr. The listen address can also be specified by
> defining NW_ADDR in the environment.

`-l`  
`--local`  
> localhost only. This is equivalent to `--addr=127.0.0.1`.

`-g`  
`--git`  
`git` (depricated)  
> Commit each save to a git repository.

`-h`  
`--help`  
`help` (depricated)  
> Display a short help message.

`-p <port>`  
`--port=<port>`  
`--port <port>`  
`<port>` (depricated)  
> Listen on <port> rather than 8888. The default port can be changed
> from 8888 by setting the PORT environment variable.

###Examples

`nodewiki`
> Starts node wiki

`nodewiki --git --local`
> Starts node wiki in git mode, listening on only 127.0.0.1 (localhost).

`nodewiki --git --local --port=9876`
> Starts node wiki in git mode, listening on port 9876, of 127.0.0.1,
> rather than the default port, 8888.

`nodewiki -glp 9876`
> Same as the above, but using short form options.

`nodewiki --help`
>displays node wiki usage.
