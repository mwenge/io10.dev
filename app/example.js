export const examplePipelines = [
  { 
    name: "Introduction - Part One",
    pipeline:
  [
  {
    key: "Example Pipeline-0a",
    program: `"""
 Welcome to
          
  You can run pretty much anything in here:
    Python, SQL,
    Javascript, Lua,
  R, Awk, Lisp.

 What we do here is compose 'pipelines' of programs. Each program
 can operate on the output of the previous one. Each program can be
 written in the language best suited to the job. Everything is run and stored 
 locally in your browser. No data leaves your computer, but you can save your
 work locally (Ctrl-S) and load it again on another computer (Ctrl-O) if you want.

 This is a short demonstration. Let's run the script below.
  - Press Ctrl-Enter to run the program. 
  - Then press Alt-Right to navigate to the next step in the pipeline.
  
This first step reads in the file EXECUTIVE.agc, which is a file 
of source code from the Apollo 11's Lunar Guidance Module.
"""
# Read in all the lines containing instructions
import sys
lines = [l for l in open('EXECUTIVE.agc', 'r').read().split('\\n') 
		 if l and l[0] not in ['\\n','','#']]

# Create a list of lists from the lines
line_table = [l.split('\\t')[:4] for l in lines]

# Make sure each list has at least 5 elements
line_table = [l + ['']*(4-len(l)) for l in line_table]

# Write the result to our output
print("LINE_NO, ROUTINE, SPACE,OPERATOR, OPERAND")
cur_routine = ""
for i,l in enumerate(line_table):
	cur_routine = l[0] if l[0] else cur_routine
	print(f"{i},{cur_routine},{','.join(l[1:])}")

`,
    input: `input line 1
input line 2
input line 3`,
    output: '',
    files: ['EXECUTIVE.agc'],
    lang: "*.py",
  },
  {
    key: "Example Pipeline-0",
    program: `-- Now we can run a query on the output from our previous step.
-- We reference it as "input.txt". Notice that it's available as
-- a file in our file list below.
SELECT ROUTINE, COUNT(*) CNT
FROM "input.txt" A 
GROUP BY 1
ORDER BY CNT DESC
LIMIT 10
`,
    input: ``,
    output: '',
    lang: "*.sql",
  },
  {
    key: "Example Pipeline-1",
    program: `// Welcome to the final step in our pipeline.
//
// Hopefully by now it will be clear that Alt in combination with Left and Right allows
// you to navigate between the steps in a pipeline.
// 
// To navigate between pipelines we use Alt-Up and Alt-Down. Alt-Up will create a new pipeline
// if one doesn't already exist there. 
//
// So in summary for pipeline navigation.:
//   - Use Alt-Left and Alt-Right to navigate between the steps on the current pipeline.
//   - Press Alt-Up to create a new pipeline.
//   - Use Alt-Up and Alt-Down to navigate between your pipelines.
//   - Use Alt-A to add a new step to a pipeline.
//
// One useful thing: at any time you can run all the steps in the pipeline from the start by
// using Alt-R. Why not try it now? The pipeline will run from the start and end up back here
// at the end.
//
// Now that you've seen the basics, let's look at a little more advanced usage.
// Use Alt-Up to navigate to the next pipeline containing the next stage of the tutorial.
//
`,
    input: ``,
    output: '',
    files: [],
    lang: "*.js",
  },
  ]
  },
  { 
    name: "Introduction - Part Two",
    pipeline:
  [
  {
    key: "Introduction Part Two-0",
    program: `# 
# Let's run some R. We have a file loaded called 'testfile.csv'. Let's read it in and print it out.
# Reminder: press Ctrl-Enter to run! :) 
# Reminder: press Alt-Right-Arrow to move to the next pipe! :) 
data <- read.csv("testfile.csv")
print(data)
    `,
    input: ``,
    output: '',
    lang: "*.r",
    files: ['testfile.csv'],
  },
  {
    key: "Introduction Part Two-1",
    program: `--  Now we're at the second step of our pipeline, this time we use Lua:
-- Input is available as 'input' local variable.
--
local output = {}
local colors = { "red", "green", "blue" }

for k, v in pairs(colors) do
  table.insert(output, input[k] .. "\\t" .. k .. ":" .. v .. "\\n")
end
table.sort(output)
return table.concat(output, '')
`,
    input: ``,
    output: '',
    lang: "*.lua",
  },
  {
    key: "Introduction Part Two-2",
    program: `#  Now we are at the third step of our pipeline, this time we use Awk:
# Once you have run this you can use Alt-Up to start creating your own pipelines. If you
# find any bugs please click on the link at the bottom left to go to the project page
# in github, where you can report them.
# I hope you find io10.dev useful!
#!/bin/awk
BEGIN {
      FS="[^a-zA-Z]+"
}
{
      for (i=1; i<=NF; i++)
            words[tolower($i)]++
}
END {
      for (i in words)
            print i, words[i]
}
`,
    input: ``,
    output: '',
    lang: "*.awk",
  },
  ]
  },
];

export const exampleFiles = [
  {
  name: 'table.csv',
  data: `id,name,salary,start_date,dept
1,Rick,623.3,2012-01-01,IT
2,Dan,515.2,2013-09-23,Operations
3,Michelle,611,2014-11-15,IT
4,Ryan,729,2014-05-11,HR
5,Gary,843.25,2015-03-27,Finance
6,Nina,578,2013-05-21,IT
7,Simon,632.8,2013-07-30,Operations
8,Guru,722.5,2014-06-17,Finance`,
  },
  {
  name: 'testfile.csv',
  data: `id,name,salary,start_date,dept
1,Rick,623.3,2012-01-01,IT
2,Dan,515.2,2013-09-23,Operations
3,Michelle,611,2014-11-15,IT
4,Ryan,729,2014-05-11,HR
5,Gary,843.25,2015-03-27,Finance
6,Nina,578,2013-05-21,IT
7,Simon,632.8,2013-07-30,Operations
8,Guru,722.5,2014-06-17,Finance`,
  },
  {
  name: 'file.txt',
  data: `id	name
1	Rick
2	Dan
3	Michelle`
  },
  {
  name: 'EXECUTIVE.agc',
  data: `# Copyright:	Public domain.
# Filename:	EXECUTIVE.agc
# Purpose: 	Part of the source code for Luminary 1A build 099.
#		It is part of the source code for the Lunar Module's (LM)
#		Apollo Guidance Computer (AGC), for Apollo 11.
# Assembler:	yaYUL
# Contact:	Ron Burkey <info@sandroid.org>.
# Website:	www.ibiblio.org/apollo.
# Pages:	1103-1114
# Mod history:	2009-05-25 RSB	Adapted from the corresponding
#				Luminary131 file, using page
#				images from Luminary 1A.
#		2011-01-06 JL	Fixed pseudo-label indentation.
#		2011-05-08 JL	Removed workaround.

# This source code has been transcribed or otherwise adapted from
# digitized images of a hardcopy from the MIT Museum.  The digitization
# was performed by Paul Fjeld, and arranged for by Deborah Douglas of
# the Museum.  Many thanks to both.  The images (with suitable reduction
# in storage size and consequent reduction in image quality as well) are
# available online at www.ibiblio.org/apollo.  If for some reason you
# find that the images are illegible, contact me at info@sandroid.org
# about getting access to the (much) higher-quality images which Paul
# actually created.
#
# Notations on the hardcopy document read, in part:
#
#	Assemble revision 001 of AGC program LMY99 by NASA 2021112-061
#	16:27 JULY 14, 1969

# Page 1103
		BLOCK	02

# TO ENTER A JOB REQUEST REQUIRING NO VAC AREA:

		COUNT*	$$/EXEC
NOVAC		INHINT
		AD	FAKEPRET	# LOC(MPAC +6) - LOC(QPRET)
		TS	NEWPRIO		# PRIORITY OF NEW JOB + NOVAC C(FIXLOC)

		EXTEND
		INDEX	Q		# Q WILL BE UNDISTURBED THROUGHOUT.
		DCA	0		# 2CADR OF JOB ENTERED.
		DXCH	NEWLOC
		CAF	EXECBANK
		XCH	FBANK
		TS	EXECTEM1
		TCF	NOVAC2		# ENTER EXECUTIVE BANK.

# TO ENTER A JOB REQUEST REQUIREING A VAC AREA -- E.G., ALL (PARTIALLY) INTERPRETIVE JOBS.

FINDVAC		INHINT
		TS	NEWPRIO
		EXTEND
		INDEX	Q
		DCA	0
SPVACIN		DXCH	NEWLOC
		CAF	EXECBANK
		XCH	FBANK
		TCF	FINDVAC2	# OFF TO EXECUTIVE SWITCHED-BANK.

# TO ENTER A FINDVAC WITH THE PRIORITY IN NEWPRIO TO THE 2CADR ARRIVING IN A AND L:
# USERS OF SPVAC MUST INHINT BEFORE STORING IN NEWPRIO.

SPVAC		XCH	Q
		AD	NEG2
		XCH	Q
		TCF	SPVACIN

# TO SUSPEND A BASIC JOB SO A HIGHER PRIORITY JOB MAY BE SERVICED:

CHANG1		LXCH	Q
		CAF	EXECBANK
		XCH	BBANK
		TCF	CHANJOB

# TO SUSPEND AN INTERPRETIVE JOB:

CHANG2		CS	LOC		# NEGATIVE LOC SHOWS JOB = INTERPRETIVE.
# ITRACE (4) REFERS TO "CHANG2"
		TS	L
# Page 1104
 +2		CAF	EXECBANK
		TS	BBANK
		TCF	CHANJOB -1

# Page 1105
# TO VOLUNTARILY SUSPEND A JOB UNTIL THE COMPLETION OF SOME ANTICIPATED EVENT (I/O EVENT ETC.):

JOBSLEEP	TS	LOC
		CAF	EXECBANK
		TS	FBANK
		TCF	JOBSLP1

# TO AWAKEN A JOB PUT TO SLEEP IN THE ABOVE FASHION:

JOBWAKE		INHINT
		TS	NEWLOC
		CS	TWO		# EXIT IS VIA FINDVAC/NOVAC PROCEDURES.
		ADS	Q
		CAF	EXECBANK
		XCH	FBANK
		TCF	JOBWAKE2

# TO CHANGE THE PRIORITY OF A JOB CURRENTLY UNDER EXECUTION:

PRIOCHNG	INHINT			# NEW PRIORITY ARRIVES IN A.  RETURNS TO
		TS	NEWPRIO		# CALLER AS SOON AS NEW JOB PRIORITY IS
		CAF	EXECBANK	# HIGHEST.  PREPARE FOR POSSIBLE BASIC-
		XCH	BBANK		# STYLE CHANGE-JOB.
		TS	BANKSET
		CA	Q
		TCF	PRIOCH2

# TO REMOVE A JOB FROM EXECUTIVE CONSIDERATIONS:

ENDOFJOB	CAF	EXECBANK
		TS	FBANK
		TCF	ENDJOB1

ENDFIND		CA	EXECTEM1	# RETURN TO CALLER AFTER JOB ENTRY
		TS	FBANK		# COMPLETE.
		TCF	Q+2
EXECBANK	CADR	FINDVAC2

FAKEPRET	ADRES	MPAC -36D	# LOC(MPAC +6) - LOC(QPRET)

# Page 1106
# LOCATE AN AVAILABLE VAC AREA

		BANK	01
		COUNT*	$$/EXEC
FINDVAC2	TS	EXECTEM1	# (SAVE CALLER'S BANK FIRST.)
		CCS	VAC1USE
		TCF	VACFOUND
		CCS	VAC2USE
		TCF	VACFOUND
		CCS	VAC3USE
		TCF	VACFOUND
		CCS	VAC4USE
		TCF	VACFOUND
		CCS	VAC5USE
		TCF	VACFOUND
		LXCH	EXECTEM1
		CA	Q
		TC	BAILOUT1
		OCT	1201		# NO VAC AREAS.

VACFOUND	AD	TWO		# RESERVE THIS VAC AREA BY STORING A ZERO
		ZL			# IN ITS VAC USE REGISTER AND STORE THE
		INDEX	A		# ADDRESS OF THE FIRST WORD OF IT IN THE
		LXCH	0 	-1	# LOW NINE BITS OF THE PRIORITY WORD.
		ADS	NEWPRIO

NOVAC2		CAF	ZERO		# NOVAC ENTERS HERE.  FIND A CORE SET.
		TS	LOCCTR
		CAF	NO.CORES	# SEVEN SETS OF ELEVEN REGISTERS EACH.
NOVAC3		TS	EXECTEM2
		INDEX	LOCCTR
		CCS	PRIORITY	# EACH PRIORITY REGISTER CONTAINS -0 IF
		TCF	NEXTCORE	# THE CORESPONDING CORE SET IS AVAILABLE.
NO.CORES	DEC	7
		TCF	NEXTCORE	# AN ACTIVE JOB HAS A POSITIVE PRIORITY
					# BUT A DORMANT JOB'S PRIORITY IS NEGATIVE

# Page 1107
CORFOUND	CA	NEWPRIO		# SET THE PRIORITY OF THIS JOB IN THE CORE
		INDEX	LOCCTR		# SET'S PRIORITY REGISTER AND SET THE
		TS	PRIORITY	# JOB'S PUSH-DOWN POINTER AT THE BEGINNING
		MASK	LOW9		# OF THE WORK AREA AND OVERFLOW INDICATOR.
		INDEX	LOCCTR
		TS	PUSHLOC		# OFF TO PREPARE FOR INTERPRETIVE PROGRAMS.

		CCS	LOCCTR		# IF CORE SET ZERO IS BEING LOADED, SET UP
		TCF	SETLOC		# OVFIND AND FIXLOC IMMEDIATELY.
		TS	OVFIND
		CA	PUSHLOC
		TS	FIXLOC

SPECTEST	CCS	NEWJOB		# SEE IF ANY ACTIVE JOBS WAITING (RARE).
		TCF	SETLOC		# MUST BE AWAKENED OUT UNCHANGED JOB.
		TC	CCSHOLE
		TC	CCSHOLE
		TS	NEWJOB		# +0 SHOWS ACTIVE JOB ALREADY SET.
		DXCH	NEWLOC
		DXCH	LOC
		TCF	ENDFIND

SETLOC		DXCH	NEWLOC		# SET UP THE LOCATION REGISTERS FOR THIS
		INDEX	LOCCTR
		DXCH	LOC
		INDEX	NEWJOB		# THIS INDEX INSTRUCTION INSURES THAT THE
		CS	PRIORITY	# HIGHEST ACTIVE PRIORITY WILL BE COMPARED
		AD	NEWPRIO		# WITH THE NEW PRIORITY TO SEE IF NEWJOB
		EXTEND			# SHOULD BE SET TO SIGNAL A SWITCH.
		BZMF	ENDFIND
		CA	LOCCTR		# LOCCTR IS LEFT SET AT THIS CORE SET IF
		TS	NEWJOB		# THE CALLER WANTS TO LOAD ANY MPAC
		TCF	ENDFIND		# REGISTERS, ETC.

NEXTCORE	CAF	COREINC
		ADS	LOCCTR
		CCS	EXECTEM2
		TCF	NOVAC3
		LXCH	EXECTEM1
		CA	Q
		TC	BAILOUT1	# NO CORE SETS AVAILABLE.
		OCT	1202
# Page 1108
# THE FOLLOWING ROUTINE SWAPS CORE SET 0 WITH THAT WHOSE RELATIVE ADDRESS IS IN NEWJOB.

 -2		LXCH	LOC
 -1		CAE	BANKSET		# BANKSET, NOT BBANK, HAS RIGHT CONTENTS.
CHANJOB		INHINT
		EXTEND
		ROR	SUPERBNK	# PICK UP CURRENT SBANK FOR BBCON
		XCH	L		# LOC IN A AND BBCON IN L.
 +4		INDEX	NEWJOB		# SWAP LOC AND BANKSET.
		DXCH	LOC
		DXCH	LOC

		CAE	BANKSET
		EXTEND
		WRITE	SUPERBNK	# SET SBANK FOR NEW JOB.
		DXCH	MPAC		# SWAP MULTI-PURPOSE ACCUMULATOR AREAS.
		INDEX	NEWJOB
		DXCH	MPAC
		DXCH	MPAC
		DXCH	MPAC 	+2
		INDEX	NEWJOB
		DXCH	MPAC 	+2
		DXCH	MPAC	+2
		DXCH	MPAC 	+4
		INDEX	NEWJOB
		DXCH	MPAC 	+4
		DXCH	MPAC 	+4
		DXCH	MPAC 	+6
		INDEX	NEWJOB
		DXCH	MPAC 	+6
		DXCH	MPAC 	+6

		CAF	ZERO
		XCH	OVFIND		# MAKE PUSHLOC NEGATIVE IF OVFIND NZ.
		EXTEND
		BZF	+3
		CS	PUSHLOC
		TS	PUSHLOC

		DXCH	PUSHLOC
		INDEX	NEWJOB
		DXCH	PUSHLOC
		DXCH	PUSHLOC		# SWAPS PUSHLOC AND PRIORITY.
		CAF	LOW9		# SET FIXLOC TO BASE OF VAC AREA.
		MASK	PRIORITY
		TS	FIXLOC

		CCS	PUSHLOC		# SET OVERFLOW INDICATOR ACCORDING TO
		CAF	ZERO
		TCF	ENDPRCHG -1

# Page 1109
		CS	PUSHLOC
		TS	PUSHLOC
		CAF	ONE
		XCH	OVFIND
		TS	NEWJOB

ENDPRCHG	RELINT
		DXCH	LOC		# BASIC JOBS HAVE POSITIVE ADDRESSES, SO
		EXTEND			# DISPATCH WITH A DTCB.
		BZMF	+2		# IF INTERPRETIVE, SET UP EBANK, ETC.
		DTCB
# Page 1110
		COM			# EPILOGUE TO JOB CHANGE FOR INTERPRETIVE
		AD	ONE
		TS	LOC		# RESUME
		TCF	INTRSM

# COMPLETE JOBSLEEP PREPARATIONS.

JOBSLP1		INHINT
		CS	PRIORITY	# NNZ PRIORITY SHOWS JOB ASLEEP.
		TS	PRIORITY
		CAF	LOW7
		MASK	BBANK
		EXTEND
		ROR	SUPERBNK	# SAVE OLD SUPERBANK VALUE.
		TS	BANKSET
		CS	ZERO
JOBSLP2		TS	BUF 	+1	# HOLDS -- HIGHEST PRIORITY.
		TCF	EJSCAN		# SCAN FOR HIGHEST PRIORITY ALA ENDOFJOB.

NUCHANG2	INHINT			# QUICK... DON'T LET NEWJOB CHANGE TO +0.
		CCS	NEWJOB
		TCF	+3		# NEWJOB STILL PNZ
		RELINT			# NEW JOB HAS CHANGED TO +0.  WAKE UP JOB
		TCF	ADVAN 	+2	# VIA NUDIRECT.  (VERY RARE CASE.)

		CAF	TWO
		EXTEND
		WOR	DSALMOUT	# TURN ON ACTIVITY LIGHT
		DXCH	LOC		# AND SAVE ADDRESS INFO FOR BENEFIT OF
		TCF	CHANJOB +4	# 	POSSIBLE SLEEPINT JOB.

# Page 1111
# TO WAKE UP A JOB, EACH CORE SET IS FOUND TO LOCATE ALL JOBS WHICH ARE ASLEEP.  IF THE FCADR IN THE
# LOC REGISTER OF ANY SUCH JOB MATCHES THAT SUPPLIED BY THE CALLER, THAT JOB IS AWAKENED.  IF NO JOB IS FOUND,
# LOCCTR IS SET TO -1 AND NO FURTHER ACTION TAKES PLACE.

JOBWAKE2	TS	EXECTEM1
		CAF	ZERO		# BEGIN CORE SET SCAN
		TS	LOCCTR
		CAF	NO.CORES
JOBWAKE4	TS	EXECTEM2
		INDEX	LOCCTR
		CCS	PRIORITY
		TCF	JOBWAKE3	# ACTIVE JOB -- CHECK NEXT CORE SET.
COREINC		DEC	12		# 12 REGISTERS PER CORE SET.
		TCF	WAKETEST	# SLEEPING JOB -- SEE IF CADR MATCHES.

JOBWAKE3	CAF	COREINC
		ADS	LOCCTR
		CCS	EXECTEM2
		TCF	JOBWAKE4
		CS	ONE		# EXIT IF SLEEPIN JOB NOT FOUND.
		TS	LOCCTR
		TCF	ENDFIND

WAKETEST	CS	NEWLOC
		INDEX	LOCCTR
		AD	LOC
		EXTEND
		BZF	+2		# IF MATCH.
		TCF 	JOBWAKE3	# EXAMINE NEXT CORE SET IF NO MATCH.

		INDEX	LOCCTR		# RE-COMPLEMENT PRIORITY TO SHOW JOB AWAKE
		CS	PRIORITY
		TS	NEWPRIO
		INDEX	LOCCTR
		TS	PRIORITY

		CS	FBANKMSK	# MAKE UP THE 2CADR OF THE WAKE ADDRESS
		MASK	NEWLOC		# USING THE CADR IN NEWLOC AND THE EBANK
		AD	2K		# HALF OF BBANK SAVED IN BANKSET.
		XCH	NEWLOC
		MASK	FBANKMSK
		INDEX	LOCCTR
		AD	BANKSET
		TS	NEWLOC +1

		CCS	LOCCTR		# SPECIAL TREATMENT IF THIS JOB WAS
		TCF	SETLOC		# ALREADY IN THE RUN (0) POSITION.
		TCF	SPECTEST

# Page 1112
# PRIORITY CHANGE.  CHANGE THE CONTENTS OF PRIORITY AND SCAN FOR THE JOB OF HIGHEST PRIORITY.

PRIOCH2		TS	LOC
		CAF	ZERO		# SET FLAG TO TELL ENDJOB SCANNER IF THIS
		TS	BUF		# JOB IS STILL HIGHEST PRIORITY.
		CAF	LOW9
		MASK	PRIORITY
		AD	NEWPRIO
		TS	PRIORITY
		COM
		TCF	JOBSLP2		# AND TO EJSCAN.

# Page 1113
# RELEASE THIS CORE SET AND VAC AREA AND SCAN FOR THE JOB OF HIGHEST ACTIVE PRIORITY.

ENDJOB1		INHINT
		CS	ZERO
		TS	BUF 	+1
		XCH	PRIORITY
		MASK	LOW9
		TS	L

		CS	FAKEPRET
		AD	L

		EXTEND
		BZMF	EJSCAN		# NOVAC ENDOFJOB

		CCS	L
		INDEX	A
		TS	0

EJSCAN		CCS	PRIORITY +12D
		TC	EJ1
		TC	CCSHOLE
		TCF	+1

		CCS	PRIORITY +24D	# EXAMINE EACH PRIORITY REGISTER TO FIND
		TC	EJ1		# THE JOB OF HIGHEST ACTIVE PRIORITY.
		TC	CCSHOLE
		TCF	+1

		CCS	PRIORITY +36D
		TC	EJ1
-CCSPR		-CCS	PRIORITY
		TCF	+1

		CCS	PRIORITY +48D
		TC	EJ1
		TC	CCSHOLE
		TCF	+1

		CCS	PRIORITY +60D
		TC	EJ1
		TC	CCSHOLE
		TCF	+1

		CCS	PRIORITY +72D
		TC	EJ1
		TC	CCSHOLE
		TCF	+1

		CCS	PRIORITY +84D
# Page 1114
		TC	EJ1
		TC	CCSHOLE
		TCF	+1

# Page 1115
# EVALUATE THE RESULTS OF THE SCAN.

		CCS	BUF 	+1	# SEE IF THERE ARE ANY ACTIVE JOBS WAITING
		TC	CCSHOLE
		TC	CCSHOLE

		TCF	+2
		TCF	DUMMYJOB
		CCS	BUF		# BUF IS ZERO IS THIS IS A PRIOCHNG AND
		TCF	+2		# CHANGED PRIORITY IS STILL HIGHEST.
		TCF	ENDPRCHG -1

		INDEX	A		# OTHERWISE, SET NEWJOB TO THE RELATIVE
		CAF	0 	-1	# ADDRESS OF THE NEW JOB'S CORE SET.
		AD	-CCSPR
		TS	NEWJOB
		TCF	CHANJOB -2

EJ1		TS	BUF 	+2
		AD	BUF 	+1	# - OLD HIGH PRIORITY.
		CCS	A
		CS	BUF 	+2
		TCF	EJ2		# NEW HIGH PRIORITY.
		NOOP
		INDEX	Q
		TC	2		# PROCEED WITH SEARCH.

EJ2		TS	BUF 	+1
		EXTEND
		QXCH	BUF		# FOR LOCATING CCS PRIORITY + X INSTR.
		INDEX	BUF
		TC	2

# Page 1116
# IDLING AND COMPUTER ACTIVITY (GREEN) LIGHT MAINTENANCE. THE IDLING ROUTINE IS NOT A JOB IN ITSELF,
# BUT RATHER A SUBROUTINE OF THE EXECUTIVE.

		EBANK=	SELFRET		# SELF-CHECK STORAGE IN EBANK.

DUMMYJOB	CS	ZERO		# SET NEWJOB TO -0 FOR IDLING.
		TS	NEWJOB
		RELINT
		CS	TWO		# TURN OFF THE ACTIVITY LIGHT.
		EXTEND
		WAND	DSALMOUT
ADVAN		CCS	NEWJOB		# IS THE NEWJOB ACTIVE?
		TCF	NUCHANG2	# YES... ONE REQUIRING A CHANGE JOB.
		CAF	TWO		# NEW JOB ALREADY IN POSITION FOR
		TCF	NUDIRECT	# EXECUTION

		CA	SELFRET
		TS	L		# PUT RETURN ADDRESS IN L.
		CAF	SELFBANK
		TCF	SUPDXCHZ +1	# AND DISPATCH JOB.

		EBANK=	SELFRET
SELFBANK	BBCON	SELFCHK

NUDIRECT	EXTEND			# TURN THE GREEN LIGHT BACK ON.
		WOR	DSALMOUT
		DXCH	LOC		# JOBS STARTED IN THIS FASHION MUST BE
		TCF	SUPDXCHZ

		BLOCK	2		# IN FIXED-FIXED SO OTHERS MAY USE.

		COUNT*	$$/EXEC

# SUPDXCHZ -- ROUTINE TO TRANSFER TO SUPEBANK.
# CALLING SEQUENCE:
#		TCF	SUPDXCHZ	# WITH 2CADR OF DESIRED LOCATION IN A + L.

SUPDXCHZ	XCH	L		# BASIC.
 +1		EXTEND
		WRITE	SUPERBNK
		TS	BBANK
		TC	L

NEG100		OCT	77677
` },
];
