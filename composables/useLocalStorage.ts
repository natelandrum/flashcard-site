interface VocabItem {
  word: string;
  translation: string;
}

interface VocabList {
  name: string;
  vocab: VocabItem[];
  knownWords: string[];
  lastUpdated: string;
}

export function useLocalStorage() {
  const storageKey = 'vocabLists';

  // Get all vocabulary lists from local storage
  const getLists = (): VocabList[] => {
    if (typeof localStorage === 'undefined') return [];
    
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  };

  // Save all vocabulary lists to local storage
  const saveLists = (lists: VocabList[]): void => {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(storageKey, JSON.stringify(lists));
  };

  // Add a new vocabulary list to local storage
  const addList = (name: string, vocab: VocabItem[]): void => {
    const lists = getLists();
    
    // Check if a list with this name already exists
    const existingListIndex = lists.findIndex(list => list.name === name);
    
    if (existingListIndex !== -1) {
      // If the list exists, update it
      lists[existingListIndex] = {
        ...lists[existingListIndex],
        vocab,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // If the list doesn't exist, add it
      lists.push({
        name,
        vocab,
        knownWords: [],
        lastUpdated: new Date().toISOString()
      });
    }
    
    saveLists(lists);
  };

  // Update the known words for a vocabulary list
  const updateList = (name: string, knownWords: string[]): void => {
    const lists = getLists();
    const listIndex = lists.findIndex(list => list.name === name);
    
    if (listIndex !== -1) {
      lists[listIndex].knownWords = knownWords;
      lists[listIndex].lastUpdated = new Date().toISOString();
      saveLists(lists);
    }
  };

  // Delete a vocabulary list from local storage
  const deleteList = (name: string): void => {
    const lists = getLists().filter(list => list.name !== name);
    saveLists(lists);
    
    // If the selected list is the one being deleted, clear the selection
    if (localStorage.getItem('selectedVocabList') === name) {
      localStorage.removeItem('selectedVocabList');
    }
  };

  // Rename a vocabulary list in local storage
  const renameList = (oldName: string, newName: string): void => {
    if (oldName === newName) return;
    
    const lists = getLists();
    const listIndex = lists.findIndex(list => list.name === oldName);
    
    if (listIndex !== -1) {
      lists[listIndex].name = newName;
      lists[listIndex].lastUpdated = new Date().toISOString();
      saveLists(lists);
      
      // Update the selected list name if necessary
      if (localStorage.getItem('selectedVocabList') === oldName) {
        localStorage.setItem('selectedVocabList', newName);
      }
    }
  };

  return {
    getLists,
    addList,
    updateList,
    deleteList,
    renameList
  };
}