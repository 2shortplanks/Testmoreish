#!/usr/bin/env perl

use 5.16.0;
use warnings;
use autodie;

use FindBin;
use File::Spec::Functions qw(:ALL);

# note everything ascii, so don't worry about utf8 et al
open my $in, "<", catfile($FindBin::Bin,updir, "testmorish.js");
open my $out, ">", catfile($FindBin::Bin,updir, "README.txt");
open my $selftest, ">", catfile($FindBin::Bin,updir, "selftest.html");

print $selftest <<'HTML';
<html>

<!-- this file is automatically created from testmoreis.js DO NOT UPDATE -->

<head>
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
<script src="testmorish.js"></script>
</head>
<body>

<h1>Self-test Suite for Testmorish</h1>

<script>
HTML

my $example = undef;
while (<$in>) {
	last unless s{\A// ?}{}s;

	print $out $_;

	s/  //;
	print $selftest $_ if $example;
	$example = 1 if /Example usage/;
}

print $selftest <<'HTML';
</script>

</body>
</html>
HTML

=head1 NAME

makereadme.pl - script to make the README.txt from the testmorish.js comments 