# emoji-js
It works for emoji transform to unicode string. Because our CA 's DB not support utf-8

`Input: Extended_Pictographic# E0.6  [11] (🔊..🔔)    speaker high volume..bell`

`Output: Extended_Pictographic# E0.6 [11] ([ej=1f50a]..[ej=1f514]) speaker high volume..bell`


**Input:**  
fully-qualified     # 🏴󠁧󠁢󠁥󠁮󠁧󠁿 E5.0 flag: England
fully-qualified     # 🏴󠁧󠁢󠁳󠁣󠁴󠁿 E5.0 flag: Scotland
fully-qualified     # 🏴󠁧󠁢󠁷󠁬󠁳󠁿 E5.0 flag: Wales

**Output:** 
fully-qualified # [ej=1f3f4-e0067-e0062-e0065-e006e-e0067-e007f] E5.0 flag: England 
fully-qualified # [ej=1f3f4-e0067-e0062-e0073-e0063-e0074-e007f] E5.0 flag: Scotland 
fully-qualified # [ej=1f3f4-e0067-e0062-e0077-e006c-e0073-e007f] E5.0 flag: Wales





`😈 how to use => see demo.html`