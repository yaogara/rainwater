#!/usr/bin/env python3
import subprocess
import sys
import json

def run_js_in_tab(url_substring, js_code):
    applescript = f'''
    tell application "Brave Browser"
        repeat with w in windows
            repeat with t in tabs of w
                if (URL of t) contains "{url_substring}" then
                    set res to execute t javascript "{js_code}"
                    return res
                end if
            end repeat
        end repeat
        return "TAB_NOT_FOUND"
    end tell
    '''
    proc = subprocess.run(['osascript', '-e', applescript], capture_output=True, text=True)
    return proc.stdout.strip(), proc.stderr.strip()

if __name__ == '__main__':
    url_sub = sys.argv[1]
    js = sys.argv[2]
    out, err = run_js_in_tab(url_sub, js)
    print("STDOUT:", out)
    if err:
        print("STDERR:", err)
