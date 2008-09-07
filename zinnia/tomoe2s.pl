#!/usr/bin/perl

use utf8;
my $value;
my $stroke;
my $strokes;

while (<>) {
    if (/<character>/) {
	while (<>) {
	    if (/<utf8>([^<]+)<\/utf8>/) {
		$value = $1;
		$value =~ s/^&#x//;
		$value = pack("U", hex($value));
		utf8::encode($value);
		$stroke = "";
		$strokes = "";
	    } elsif (/<point x=\"(\d+)\" y=\"(\d+)\"/) {
		my $x = $1;
		my $y = $2;
#		print "$x $y\n";
		$stroke .= "($x $y)";
	    } elsif (/<\/stroke>/) {
		$strokes .= "($stroke)";
		$stroke = "";
	    } elsif (/<\/character>/) {
                if ($value !~ /[\(\)]/) {
                    print "(character (value $value)(width 1000)(height 1000)(strokes $strokes))\n";
                }
		$value = "";
		last;
	    }
	}
    }
}
