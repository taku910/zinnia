#!/usr/bin/perl

#дв
#  :3
#  2 (54 58) (249 68)
#  3 (147 10) (145 201) (182 252)
#  9 (224 103) (149 230) (82 240) (53 204) (86 149) (182 139) (240 172) (248 224) (228 250)

while (1) {
    my $c = <>;
    last if (!$c);
    chomp $c;
    print "(character (value $c) (width 300) (height 300) ";
    my $n = <>;
    chomp $n;
    $n =~ /:(\d+)/;
    $n = $1;
    print "(strokes";
    for (my $i = 0; $i < $n; ++$i) {
	my $l = <>;
	$l =~ s/\(//g;
	$l =~ s/\)//g;
	print " (";
	my @a = split /\s+/, $l;
	shift @a;	
	for (my $j = 0; $j <= $#a; $j += 2) {
	    printf "(%d %d)", $a[$j],  $a[$j+1];
	}
	print ")";
    }
    print "))\n";
    my $tmp = <>;
}
