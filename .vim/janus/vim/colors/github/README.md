Github theme for vim.
Shamlessly yanked from @joshuaclayton
Modified a bit. (Removed all instances of annoying pure red color)

        $ diff github.palette github.palette.original
        23c23
        <   SpecialKey   "FFF",    "3465A4", :gui => :italic
        ---
        >   SpecialKey   "FFF",    "F10", :gui => :italic
        26c26
        <   Directory    "0086B3"
        ---
        >   Directory    "900"
        45d44
        <   Regex        "009926"
        47,49c46,47
        <   Error        "F8F8FF", "EF5939"
        <   ErrorMsg        "F8F8FF", "EF5939"
        <   Todo         "F8F8FF", "EF5939", :gui => :underline
        ---
        >   Error        "F8F8FF", "FF1100"
        >   Todo         "F8F8FF", "FF1100", :gui => :underline

