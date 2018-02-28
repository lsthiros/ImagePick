#! /usr/bin/env sh

cat << EOF > prod/index.html
<html>
  <head>
  <script>

EOF

cat javascript/bundle.min.js >> prod/index.html

cat << EOF >> prod/index.html

    </script>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  </head>
  <div id="headerArea"></div>
  <div id="container"></div>
  <div id="submitArea"></div>
</html>
EOF
