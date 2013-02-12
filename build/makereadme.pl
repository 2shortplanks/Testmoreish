#!/usr/bin/env perl

use 5.16.0;
use warnings;
use autodie;

use FindBin;
use File::Spec::Functions qw(:ALL);

# note everything ascii, so don't worry about utf8 et al
open my $in, "<", catfile($FindBin::Bin,updir, "testmorish.js");
open my $out, ">", catfile($FindBin::Bin,updir, "README.txt");

while (<$in>) {
	last unless s{\A// ?}{}s;
	print $out $_;
}

=head1 NAME

makereadme.pl - script to make the README.txt from the testmorish.js comments 