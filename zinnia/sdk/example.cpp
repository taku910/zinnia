#include <iostream>
#include "zinnia.h"

static const char *input =
  "(character (width 1000)(height 1000)"
  "(strokes ((243 273)(393 450))((700 253)(343 486)(280 716)(393 866)(710 880))))";

int main(int argc, char **argv) {
  zinnia::Recognizer *recognizer = zinnia::Recognizer::create();
  if (!recognizer->open("/usr/local/lib/zinnia/model/tomoe/handwriting-ja.model")) {
    std::cerr << recognizer->what() << std::endl;
    return -1;
  }

  zinnia::Character *character = zinnia::Character::create();
  if (!character->parse(input)) {
    std::cerr <<character->what() << std::endl;
    return -1;
  }

  {
    zinnia::Result *result = recognizer->classify(*character, 10);
    if (!result) {
        std::cerr << recognizer->what() << std::endl;
       return -1;
    }
    for (size_t i = 0; i < result->size(); ++i) {
      std::cout << result->value(i) << "\t" << result->score(i) << std::endl;
    }
    delete result;
  }

  character->clear();
  character->set_width(300);
  character->set_height(300);
  character->add(0, 51, 29);
  character->add(0, 117, 41);
  character->add(1, 99, 65);
  character->add(1, 219, 77);
  character->add(2, 27, 131);
  character->add(2, 261, 131);
  character->add(3, 129, 17);
  character->add(3, 57, 203);
  character->add(4, 111, 71);
  character->add(4, 219, 173);
  character->add(5, 81, 161);
  character->add(5, 93, 281);
  character->add(6, 99, 167);
  character->add(6, 207, 167);
  character->add(6, 189, 245);
  character->add(7, 99, 227);
  character->add(7, 189, 227);
  character->add(8, 111, 257);
  character->add(8, 189, 245);

  {
    zinnia::Result *result = recognizer->classify(*character, 10);
    if (!result) {
        std::cerr << recognizer->what() << std::endl;
       return -1;
    }
    for (size_t i = 0; i < result->size(); ++i) {
      std::cout << result->value(i) << "\t" << result->score(i) << std::endl;
    }
    delete result;
  }
   
  delete character;
  delete recognizer; 

  return 0;
}
