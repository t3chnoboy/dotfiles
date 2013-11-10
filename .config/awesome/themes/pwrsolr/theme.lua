    --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
--{{  Awesome Powerarrow theme by Rom Ockee - based on Awesome Zenburn and Need_Aspirin themes }}---
--{{  Modified by eco32i to use Solarized colors (http://ethanschoonover.com/solarized)        }}---
    --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

green = "#859900"
cyan  = "#2aa198"
red   = "#dc322f"
lblue = "#268bd2"
dblue = "#6c71c4"
black = "#002b36"
lgrey = "#93a1a1"
dgrey = "#839496"
white = "#fdf6e3"

theme = {}

--theme.wallpaper_cmd = { "awsetbg /home/ilya/.config/awesome/themes/powerarrow/wallpapers/wallpaper-2552963.jpg" }
theme.wallpaper_cmd = { "awsetbg /usr/share/backgrounds/Winter_Fog_by_Daniel_Vesterskov.jpg" }

theme.font                                  = "sans 8"
theme.fg_normal                             = "#839496"
theme.fg_focus                              = "#eee8d5"
theme.fg_urgent                             = "#586e75"
theme.bg_normal                             = "#002b36"
theme.bg_focus                              = "#495664"
theme.bg_urgent                             = "#cb4b16"
theme.border_width                          = "1"
theme.border_normal                         = "#073642"
theme.border_focus                          = "#002b36"
theme.border_marked                         = lblue

theme.titlebar_bg_focus                     = "#495664"
theme.titlebar_bg_normal                    = "#495664"

theme.taglist_bg_focus                      = "#eee8d5" 
theme.taglist_fg_focus                      = "#657b83"

theme.tasklist_bg_focus                     = "#495664" 
theme.tasklist_fg_focus                     = "#eee8d5"

theme.textbox_widget_as_label_font_color    = white 
theme.textbox_widget_margin_top             = 1

theme.text_font_color_1                     = green
theme.text_font_color_2                     = dblue
theme.text_font_color_3                     = white

theme.notify_font_color_1                   = green
theme.notify_font_color_2                   = dblue
theme.notify_font_color_3                   = black
theme.notify_font_color_4                   = white
theme.notify_font                           = "sans 9"
theme.notify_fg                             = theme.fg_normal
theme.notify_bg                             = theme.bg_normal
theme.notify_border                         = theme.border_focus

theme.awful_widget_bckgrd_color             = dgrey
theme.awful_widget_border_color             = dgrey
theme.awful_widget_color                    = dblue
theme.awful_widget_gradien_color_1          = orange
theme.awful_widget_gradien_color_2          = orange
theme.awful_widget_gradien_color_3          = orange
theme.awful_widget_height                   = 14
theme.awful_widget_margin_top               = 1

-- There are other variable sets
-- overriding the default one when
-- defined, the sets are:
-- [taglist|tasklist]_[bg|fg]_[focus|urgent]
-- titlebar_[normal|focus]
-- tooltip_[font|opacity|fg_color|bg_color|border_width|border_color]
-- Example:
-- theme.taglist_bg_focus = "#CC9393"
-- }}}

-- {{{ Widgets
-- You can add as many variables as
-- you wish and access them by using
-- beautiful.variable in your rc.lua
-- theme.fg_widget        = "#AECF96"
-- theme.fg_center_widget = "#88A175"
-- theme.fg_end_widget    = "#FF5656"
-- theme.bg_widget        = "#494B4F"
-- theme.border_widget    = "#3F3F3F"

theme.mouse_finder_color = "#CC9393"
-- mouse_finder_[timeout|animate_timeout|radius|factor]

-- theme.menu_bg_normal    = ""
-- theme.menu_bg_focus     = ""
-- theme.menu_fg_normal    = ""
-- theme.menu_fg_focus     = ""
-- theme.menu_border_color = ""
-- theme.menu_border_width = ""
theme.menu_height       = "24"
theme.menu_width        = "140"

--{{ Icon dirs -----------------------------------------------------------------------------------------------
icons_dir       = (themes_dir .. "/pwrsolr/icons/pwrsolr")
apps_dir        = (themes_dir .. "/pwrsolr/apps")
layout_dir      = (themes_dir .. "/pwrsolr/layouts")
taglist_dir     = (themes_dir .. "/pwrsolr/taglist")
tasklist_dir    = (themes_dir .. "/pwrsolr/tasklist")
titlebar_dir    = (themes_dir .. "/pwrsolr/titlebar")

--{{--- Theme icons ------------------------------------------------------------------------------------------

theme.awesome_icon                              = icons_dir .. "/awesome-icon.png"
theme.clear_icon                                = icons_dir .. "/clear.png"
theme.menu_submenu_icon                         = icons_dir .. "/submenu.png"

theme.tasklist_floating_icon                    = tasklist_dir .. "/floatingm.png"

theme.titlebar_close_button_focus               = titlebar_dir .. "/close_focus.png"
theme.titlebar_close_button_normal              = titlebar_dir .. "/close_normal.png"
theme.titlebar_ontop_button_focus_active        = titlebar_dir .. "/ontop_focus_active.png"
theme.titlebar_ontop_button_normal_active       = titlebar_dir .. "/ontop_normal_active.png"
theme.titlebar_ontop_button_focus_inactive      = titlebar_dir .. "/ontop_focus_inactive.png"
theme.titlebar_ontop_button_normal_inactive     = titlebar_dir .. "/ontop_normal_inactive.png"
theme.titlebar_sticky_button_focus_active       = titlebar_dir .. "/sticky_focus_active.png"
theme.titlebar_sticky_button_normal_active      = titlebar_dir .. "/sticky_normal_active.png"
theme.titlebar_sticky_button_focus_inactive     = titlebar_dir .. "/sticky_focus_inactive.png"
theme.titlebar_sticky_button_normal_inactive    = titlebar_dir .. "/sticky_normal_inactive.png"
theme.titlebar_floating_button_focus_active     = titlebar_dir .. "/floating_focus_active.png"
theme.titlebar_floating_button_normal_active    = titlebar_dir .. "/floating_normal_active.png"
theme.titlebar_floating_button_focus_inactive   = titlebar_dir .. "/floating_focus_inactive.png"
theme.titlebar_floating_button_normal_inactive  = titlebar_dir .. "/floating_normal_inactive.png"
theme.titlebar_maximized_button_focus_active    = titlebar_dir .. "/maximized_focus_active.png"
theme.titlebar_maximized_button_normal_active   = titlebar_dir .. "/maximized_normal_active.png"
theme.titlebar_maximized_button_focus_inactive  = titlebar_dir .. "/maximized_focus_inactive.png"
theme.titlebar_maximized_button_normal_inactive = titlebar_dir .. "/maximized_normal_inactive.png"

theme.taglist_squares_sel                       = taglist_dir .. "/square_sel.png"
theme.taglist_squares_unsel                     = taglist_dir .. "/square_unsel.png"

theme.layout_floating                           = layout_dir .. "/floating.png"
theme.layout_tile                               = layout_dir .. "/tile.png"
theme.layout_tileleft                           = layout_dir .. "/tileleft.png"
theme.layout_tilebottom                         = layout_dir .. "/tilebottom.png"
theme.layout_tiletop                            = layout_dir .. "/tiletop.png"

theme.widget_battery                            = icons_dir .. "/bat.png"
theme.widget_mem                                = icons_dir .. "/mem.png"
theme.widget_cpu                                = icons_dir .. "/cpu.png"

theme.widget_temp                               = icons_dir .. "/temp.png"
theme.widget_net                                = icons_dir .. "/net.png"

theme.arr_base01_base2                          = icons_dir .. "/arr_base01_base2.png"
theme.arr_base01_base03                         = icons_dir .. "/arr_base01_base03.png"
theme.arr_base01_green                          = icons_dir .. "/arr_base01_green.png"
theme.arr_base2_base0                           = icons_dir .. "/arr_base2_base0.png"
theme.arr_base2_base01                          = icons_dir .. "/arr_base2_base01.png"
theme.arr_base2_base03                          = icons_dir .. "/arr_base2_base03.png"
theme.arr_base2_green                           = icons_dir .. "/arr_base2_green.png"
theme.arr_base03_base0                          = icons_dir .. "/arr_base03_base0.png"
theme.arr_base03_base01                         = icons_dir .. "/arr_base03_base01.png"
theme.arr_base03_base2                          = icons_dir .. "/arr_base03_base2.png"
theme.arr_base03_green                          = icons_dir .. "/arr_base03_green.png"
theme.arr_green_base0                           = icons_dir .. "/arr_green_base0.png"
theme.arr_green_base01                          = icons_dir .. "/arr_green_base01.png"
theme.arr_green_base2                           = icons_dir .. "/arr_green_base2.png"

theme.widget_gmail                              = icons_dir .. "/gmail.png"

--{{--- User icons ------------------------------------------------------------------------------------------
theme.hibernate_icon            = apps_dir .. "/gnome-session-hibernate.png"
theme.suspend_icon              = apps_dir .. "/gnome-session-suspend1.png"
theme.halt_icon                 = apps_dir .. "/gnome-session-halt1.png"

theme.htop_icon                 = apps_dir .. "/system-monitor.png"
theme.vlc_icon                  = apps_dir .. "/vlc.png"
theme.eclipse_icon              = apps_dir .. "/eclipse.png"
theme.galculator_icon           = apps_dir .. "/accessories-calculator.png"
theme.gedit_icon                = apps_dir .. "/text-editor.png"
theme.terminal_icon             = apps_dir .. "/terminal.png"
theme.terminalroot_icon         = apps_dir .. "/gksu-root-terminal.png"
theme.system_icon               = apps_dir .. "/processor.png"
theme.gimp_icon                 = apps_dir .. "/gimp.png"
theme.inkscape_icon             = apps_dir .. "/inkscape.png"
theme.myofficemenu_icon         = apps_dir .. "/applications-office.png"
theme.mygraphicsmenu_icon       = apps_dir .. "/applications-graphics.png"
theme.mywebmenu_icon            = apps_dir .. "/applications-internet2.png"

theme.librebase_icon            = apps_dir .. "/libreoffice3-base2.png"
theme.librecalc_icon            = apps_dir .. "/libreoffice3-calc2.png"
theme.libredraw_icon            = apps_dir .. "/libreoffice3-draw2.png"
theme.libreimpress_icon         = apps_dir .. "/libreoffice3-impress2.png"
theme.libremath_icon            = apps_dir .. "/libreoffice3-math.png"
theme.librewriter_icon          = apps_dir .. "/libreoffice3-writer2.png"

theme.firefox_icon              = apps_dir .. "/firefox.png"
theme.thunderbird_icon          = apps_dir .. "/thunderbird.png"
theme.vym_icon                  = apps_dir .. "/vym.png"
theme.chromium_icon             = apps_dir .. "/google-chrome.png"
theme.dropbox_icon              = apps_dir .. "/dropbox.png"

--{{----------------------------------------------------------------------------

return theme


