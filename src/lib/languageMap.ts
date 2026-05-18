export interface LanguageConfig {
  id: number;
  name: string;
  template: string;
}

export const LANGUAGE_MAP: Record<string, LanguageConfig> = {
  'c++': {
    id: 54, // GCC 9.2.0
    name: 'C++',
    template: `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;

    vector<int> arr(n);

    for(int i = 0; i < n; i++) {
        cin >> arr[i];
    }

    // Write your code here

    return 0;
}`
  },
  'python': {
    id: 71, // Python 3.8.1
    name: 'Python',
    template: `n = int(input())
arr = list(map(int, input().split()))

# Write your code here
`
  }
};

export const getLanguageConfig = (language: string): LanguageConfig | undefined => {
  return LANGUAGE_MAP[language.toLowerCase()];
};
