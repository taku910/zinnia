#include <stdio.h>
#include "zinnia.h"

static const char *input =
  "(character (width 1000)(height 1000)"
  "(strokes ((243 273)(393 450))((700 253)(343 486)(280 716)(393 866)(710 880))))";

int main(int argc, char **argv) {
  zinnia_recognizer_t *recognizer = zinnia_recognizer_new();
  zinnia_character_t  *character  = zinnia_character_new();
  if (!zinnia_recognizer_open(recognizer, "/usr/local/lib/zinnia/model/tomoe/handwriting-ja.model")) {
    fprintf(stderr, "ERROR1: %s\n", zinnia_recognizer_strerror(recognizer));
    return -1;
  }

  if (!zinnia_character_parse(character, input)) {
    fprintf(stderr, "ERROR: %s %s\n", zinnia_character_strerror(character), input);
    return -1;
  }

  {
    zinnia_result_t *result = zinnia_recognizer_classify(recognizer, character, 10);
    size_t i; 
    if (!result) {
      fprintf(stderr, "ERROR: %s %s\n", zinnia_recognizer_strerror(recognizer), input);
      return -1;
    }
    for (i = 0; i < zinnia_result_size(result); ++i) {
      fprintf(stdout, "%s\t%f\n",
              zinnia_result_value(result, i),
              zinnia_result_score(result, i));
    }
    zinnia_result_destroy(result);
 }

  zinnia_character_clear(character);
  zinnia_character_set_width(character, 300);
  zinnia_character_set_height(character, 300);
  zinnia_character_add(character, 0, 51, 29);
  zinnia_character_add(character, 0, 117, 41);
  zinnia_character_add(character, 1, 99, 65);
  zinnia_character_add(character, 1, 219, 77);
  zinnia_character_add(character, 2, 27, 131);
  zinnia_character_add(character, 2, 261, 131);
  zinnia_character_add(character, 3, 129, 17);
  zinnia_character_add(character, 3, 57, 203);
  zinnia_character_add(character, 4, 111, 71);
  zinnia_character_add(character, 4, 219, 173);
  zinnia_character_add(character, 5, 81, 161);
  zinnia_character_add(character, 5, 93, 281);
  zinnia_character_add(character, 6, 99, 167);
  zinnia_character_add(character, 6, 207, 167);
  zinnia_character_add(character, 6, 189, 245);
  zinnia_character_add(character, 7, 99, 227);
  zinnia_character_add(character, 7, 189, 227);
  zinnia_character_add(character, 8, 111, 257);
  zinnia_character_add(character, 8, 189, 245);
   
  {
    zinnia_result_t *result = zinnia_recognizer_classify(recognizer, character, 10);
    size_t i;  
    if (!result) {
      fprintf(stderr, "%s\n", zinnia_recognizer_strerror(recognizer));
      return -1;
    }
    for (i = 0; i < zinnia_result_size(result); ++i) {
      fprintf(stdout, "%s\t%f\n",
              zinnia_result_value(result, i),
              zinnia_result_score(result, i));
    }
    zinnia_result_destroy(result);
  }

  zinnia_character_destroy(character);
  zinnia_recognizer_destroy(recognizer);

  return 0;
}
