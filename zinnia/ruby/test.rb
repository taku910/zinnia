#!/usr/bin/ruby

require 'zinnia';

input = "(character (value と)(width 1000)(height 1000)(strokes ((243 273)(393 450))((700 253)(343 486)(280 716)(393 866)(710 880))))"
  
s = Zinnia::Character.new
r = Zinnia::Recognizer.new
r.open("/usr/local/lib/zinnia/model/tomoe/handwriting-ja.model")

begin
  die s.what() if (!s.parse(input))
  result = r.classify(s, 10)
  size = result.size()
  size.times { |i|
    printf "%s\t%f\n", result.value(i), result.score(i)
  }

  s.clear();
  s.set_width(300)
  s.set_height(300)
  s.add(0, 51, 29)
  s.add(0, 117, 41)
  s.add(1, 99, 65)
  s.add(1, 219, 77)
  s.add(2, 27, 131)
  s.add(2, 261, 131)
  s.add(3, 129, 17)
  s.add(3, 57, 203)
  s.add(4, 111, 71)
  s.add(4, 219, 173)
  s.add(5, 81, 161)
  s.add(5, 93, 281)
  s.add(6, 99, 167)
  s.add(6, 207, 167)
  s.add(6, 189, 245)
  s.add(7, 99, 227)
  s.add(7, 189, 227)
  s.add(8, 111, 257)
  s.add(8, 189, 245)

  result = r.classify(s, 10)
  size = result.size()
  size.times { |i|
    printf "%s\t%f\n", result.value(i), result.score(i)
  }

rescue
  print "RuntimeError: ", $!, "\n"
end
