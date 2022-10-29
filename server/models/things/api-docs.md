# My understanding of the Things Cloud API (from Culturedcode)

- The Things Cloud works basicaly like git. As said in [state-of-sync article-part-ii](https://culturedcode.com/things/blog/2011/03/state-of-sync-part-ii/). The reasons and advandeges of that are also described in that article.

- ## Old Articels on the Things Blog about the cloud.
	- https://culturedcode.com/things/blog/2010/12/state-of-sync-part-1/
	- https://culturedcode.com/things/blog/2011/01/state-of-sync-part-ii/
	- https://culturedcode.com/things/blog/2011/03/state-of-sync-part-iii/
	- especially part 2 is interesting
<br/>&nbsp;
- ##  Auth: 
	- A GET request to "https://cloud.culturedcode.com/version/1/account/\<email of account>" with an Request Header called "authorization" and a value of "Password\<a space and then the password of the account>"
	- without the authorization header or on any other error it returns ""IsSyncronyErrorResponse": true"
	- on success it returns some things and among them is the history-key which is used to acces the data of the account. (Like a token)
<br/>&nbsp;
	- The things app then also does a GET request to "https://cloud.culturedcode.com/version/1/account/\<email of account>/own-history-key", with the same authorization header. I don't know why this is necessary, but it tells the latest shema version which i don't know what it means.....yet....
<br/>&nbsp;
- ## The Sync
	- Every commit gets a number that increments with every commit(if that makes sense).
	- A Client that goes online (wants to see if there is sth new on the cloud) sends a GET request to "https://cloud.culturedcode.com/version/1/history/\<history key of account>/items?start-index=\<start index of client>"
	- \<start index of client> is the last commit that client knows about. (from the last time it synced with the cloud)
	- if the client is already up to date the items property in the return body is an empty array, and the returned "current-item-index" is the same as the one the client sent to the server. 
	- if there are now changes/commits that the client does not yet have, all those changes/commits are in the items array and there is also the new "current-item-index" that the client is going to use for future requests. The changes in the item array are evaluated, written to the database and updated in the UI.

---
<br/>&nbsp;
## What all the things in the changes/commits mean
### an example:

	items = [
		{
			uid: {
			"e": "Task2", 			
			"p": {
				"acrd": None,
				"ar": [],
				"cd": now,
				"dd": duedate,
				"dl": [],
				"do": 0,
				"icc": 0,
				"icp": False,
				"icsd": None,
				"ix": 0,
				"md": now,
				"nt": note,
				"pr": [],
				"rr": None,
				"rt": [],
				"sp": None,
				"sr": sr,
				"ss": 0,
				"st": st,
				"tg": [],
				"ti": 0,
				"tp": 0,
				"tr": False,
				"tt": title
			},
			"t": 0
		},
		uid:{
			another item that changed in that commit
		}
	},
	{
		the next commit
	}
	]

# Item

### "e": version (i think)
	- eg: Task4, Task6, ChecklistItem3
### "t" task
	- 0 for Create???
	- 1 for Update and Create ??
	- 2 for delete/trash
### "p": changes


# Task6

### other Things (in the sqliteDB)
	- stopDate
	- start
	- startDate
	- delegate
	- actionGroup
	- untrashedLeafActionsCount
	- openUntrashedLeafActionsCount
	- checklistItemsCount
	- openChecklistItemsCount
	- startBucket
	- alarmTimeOffset
	- lastAlarmInteractionDate
	- todayIndexReferenceDate
	- nextInstanceStartDate
	- dueDateSuppressionDate
	- leavesTombstone
	- repeater
	- repeaterMigrationDate
	- repeaterRegularSlotDatesCache
	- notesSync
	- cachedTags

### "acrd"
	- afterCompletionReferenceDate

### "ar"
	- area

### "cd": 
	- CreateDate
	- UnixMills
### "dd": 
	- DueDate
	- UnixMills
### "dl":
	- Deadline
	- UnixMills
### "do"
	- DueDateOffset ??
### "icc"
	- instanceCreationCount

### "icp"
	- instanceCreationPaused

### "icsd"
	- instanceCreationStartDate

### "ix"
	- Index
### "md"	
	- UserModificationDate
	- UnixMills
### "nt"	
	- Notes
### "pr"
	- Projekt

### "rr"
	- recurrenceRule

### "rt"
	- repeatingTemplate

### "sp"
	- submission/tick off date
	- stopDate ??
### "sr"
	- planed date
	- null for "Irgendwann"
	- startDate ??
### "tir"
	- also planed date it seems like
	- null for "Irgendwann"
	- todayIndexReferenceDate ??
### "ss"
	- Status
	- 0 for unticked
	- 2 for crossed out
	- 3 for ticked
### "st"
	- some sort of in what folder it is in
		- 1 for Heute
		- 2 for Planned und "Irgendwann"
### "sb"
	- another sort of in what folder it is in, but this time sub-folder
		- 0 for Today
		- 1 for Today evening
### "tg"	
	- Tags
	- Array of taguuids
### "ti"
	- TodayIndex ????

### "tp"
	- Type
		- 0 for Task
		- 1 for Projekt
		- 2 for Heading
### "tr"	
	- Trashed
### "tt"
	- Title

# Tag4

### "pn"[],
	- Array of parent tags
	- can only be asigned one in ios ui
### "ix"0,
	- Index
	- (in tag menue)
### "sh"
	- i don't know
	- was always null for me
### "tt""Test"
	- Title


# ChecklistItem3

### "lt"
	- leavesTombstone
	- INT
### "cd"
	- Creation Date [UnixMills]
### "ts"
	- Tasks [Array of Taskids]
### "sp"
	- Submission Date [UnixMills]
### "ss"
	- Status [Bool]
	- 0 for unticked
	- 3 for don
	- 2 for cross
### "md"
	- Modification Date [UnixMills]
### "tt"
	- Title [String]
### "ix"
	- Index [Int]


# Notes
- Only sync the part of the note that changed

  "nt": {
        "t": 2,
        "ps": [
          {
            "r": "", 				replace
            "p": 25,					start position
            "l": 3,					length
            "ch": 2438657415		??
          }
        ],
        "_t": "tx"
      },
