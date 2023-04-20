#include <iostream>
#include <fstream>
#include <functional>
#include <ctime>

using namespace std;

namespace Commands {
  auto help = []() {
    cout << "help" << endl;
  };

  /**
   * Collect the blog name and create a file to allow the user to edit the blog.
   */
  auto add = []() {
    string blogName;
    cout << "Blog Name (kebab-case): ";
    cin >> blogName;

    // Create a file to allow the user to edit the blog.
    ofstream blogFile;
    blogFile.open(blogName + ".md", ios::out);
    blogFile << "# " << blogName << endl;
    blogFile.close();
  };


  /**
   * Get current date mm/dd/yyyy.
   */
  auto getCurrentDate = []() {
    time_t now = time(0);
    tm *ltm = localtime(&now);
    return to_string(ltm->tm_mday) + "/" + to_string(1 + ltm->tm_mon) + "/" + to_string(1900 + ltm->tm_year);
  };

  /**
   * Add to the index file.
   */
  auto addToIndexFile = [](string blogName) {
    ofstream indexFile;
    indexFile.open("index.json", ios::app);
    // index properties are title, author, date, description, and location.
    indexFile << "  {" << endl;
    indexFile << "    \"title\": \"" << blogName << "\"," << endl;
    indexFile << "    \"author\": \"Cogwizzle\"," << endl;
    indexFile << "    \"date\": \"" << getCurrentDate() << "\"," << endl;
    indexFile << "    \"description\": \"\"," << endl;
    indexFile << "    \"location\": \"" << blogName << ".html\"" << endl;
    indexFile << "  }," << endl;
    indexFile.close();
  };

  /**
   * Add to the index file and the rss file.
   */
  auto publish = []() {
    string blogName;
    cout << "Blog Name (kebab-case): ";
    cin >> blogName;

    // Add to the index file.
    addToIndexFile(blogName);

    // TODO make this a function.
    // Add to the rss file.
    ofstream rssFile;
    rssFile.open("rss.xml", ios::app);
    rssFile << "<item>" << endl;
    rssFile << "  <title>" << blogName << "</title>" << endl;
    rssFile << "  <link>https://www.cogwizzle.com/#blog/" << blogName << ".html</link>" << endl;
    rssFile << "  <guid>https://www.cogwizzle.com/#blog/" << blogName << ".html</guid>" << endl;
    // TODO make this new function for getting the publication date.
    rssFile << "  <pubDate>" << getCurrentDate() << "</pubDate>" << endl;
    rssFile << "  <description>" << "</description>" << endl;
    rssFile << "</item>" << endl;
    rssFile.close();

    // TODO convert markdown file into html file.
  };
}
