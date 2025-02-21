Basically when I first started coding this backend, I didn't read the prompt properly and cloned directly from the repo instead of making a fork first.
So once I completely finished coding the backend (In which all tests were passing and I wrote some of my own tests), when I tried 'git push' it told me that I wasn't authorised,
so upon rereading the spec, I realised I was an idiot and then forked and cloned from my own fork, which is this one. BUT, upon copy and pasting my work directly from 
the corresponding .py and test.spec.ts pages that I had been working on locally, for some reason, the test pages are bugging out. I didn't change anything and so I assume the
tests will remain passing cause they were passing locally, its probably something to do with the way I cloned it or how the directories are organised, but can't seem to figure it out.

Please let me know if you guys want to see my actual local files. Had a look at the package.json files and they are identical, and I made sure I have
npm installed and that jest is inside "test" in the json files. Not sure where my issue was coming from and if its purely local
