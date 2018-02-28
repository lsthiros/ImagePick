all:
	tsc
	browserify -t browserify-handlebars typescript/main.js typescript/imagegrid.js -o javascript/bundle.js

prod/index.html: all
	uglifyjs javascript/bundle.js --mangle --compress -o javascript/bundle.min.js
	./buildpage.sh

prod: prod/index.html

publish: prod
	aws s3 sync prod s3://cprc-road-detect/sandbox
