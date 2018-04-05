Hieraexplorer
=============

Copy your hieradata to data/hieradata.
Set your host pattern and hierarchy in conf/hieraexplorer.yaml


```docker build -t hieraexplorer .```


```docker run -d -p 8080:8080 hieraexplorer```

or

```docker run -d -p 8080:8080 -v "$PWD/data:/data" -v $PWD/conf/hieraexplorer.yaml:/usr/src/app/conf/hieraexplorer.yaml hieraexplorer```
