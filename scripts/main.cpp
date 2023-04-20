#include <iostream>

int main(const int argc, const char* argv[]) {
  if (argc != 2) {
    Commands::help();
  }
  if (argv[1] == "help") {
    Commands::help();
  }
  if (argv[1] == "add") {
    Commands::add();
  }
  return 0;
}
