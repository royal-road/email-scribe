# Newsletter Builder

![Update Aug 23](public/readme/update29Aug.png)
This is a simple SPA to build an email newsletter from Block-like UI.

## How to run

- Clone the repo
- Run `bun i`
- Extract your templates in `Templates` folder (the folder structure should be like `Templates/xyzTemplate/` and `index.html` should be inside it alongside any images it needs, they'll be relatively used)
- First run `bun serve` to start mock api (tho it really handles image uploads and resizing)
- Then in a new terminal, run `bun run dev`
- `bun run build` + `bun run preview` doesn't play well with api right now bcoz of relative paths.

- [] Get templating up and running proper.

## Feedback

- [x] Fix Import
- [] Make a RR-Specific Template w/ footer and everything
- [] Do a better job of showing multiple block settings w/ visual language
- [] Add Undo/Redo
- [] Look into better grouping of editables (low-priority)
- [] Better Markup in multiline Text Editors (no links in singleLines)
- [] Templating for unsubscribe Button Kinda already exists w/ the wip templating

## ISSUES TO SOLVE (28)

- [x] Remove all Stampready data-attributes from the final HTML because they're not valid html attributes and might cause issues. (Same for singleline, multiline tags)
- [] Header-BG-color stops working if a new Header-BG is provided. - Might need to first add image then reapply bg

## Features in Mind

- [X]Search for blocks, better tagging, filter by tags
- [X]Add a way to edit global settings for selected blocks at once.
- Templating for iterated items for server-side rendering.
- [X]Better layout for Collpablisble's closed state. (not very responsive rn)

### Next set of features 26th Aug

- [x] Create a save/load system, ~~possibly even generate preview thumbnails~~

### Next set of features 27th Aug

- [] Add a way to edit global settings for selected blocks at once.
- [x] Add an iframe-to-editor binding. (So that when a block is selected, it's properties are shown in the editor)
  - Add ids to actual elements based on propname
  - Add ids to Collapsibles, each form item already has id.
  - Add ids to collapsible and module

# Deprecated

## TO DO/IDEAS

- [x] Use a collapsible with an additional up/down arrow to rearraange the blocks
- [x] Fill each block with a default content

## Blocks and what they'll contain

#### Will Contain:

- [x] Schema for each block
- [] Possibly Form UI for each block -- DEPRECATED
- [-] Equivalent HTML template for each block with ability to accept data (which are templatable)
- [x] A metadata like config thing with name, thumbnail image, and possibly a description

#### Functions

- [x] Ability to add new blocks and chose from a list of blocks, (maybe open this in a dialog box or popover)

### Parsing templates

- Fetch an html
- Query select all with attribute data-module [data-module]
  - (All the following steps are now isolated inside each module)
  1. data-bgcolor:
     1. Get all nodes with [data-bgcolor]
     2. Find all unique ones and distribute each in their own separate array (just pointers)
     3. For each unique one, create a new property in schema named after value from their data-bgcolor (and also have ui-widget:color for this type)
     4. Now, in same nodes, add handlebars at [bgcolor] (not [data-bgcolor]) for same prop name.
  2. data-bg: Get all with [data-bg] then same as above
     - Hmm, no size is provided for them in tags, might be worth fetching the provided image and checking its dimensions
     - This does NOT include images used with img-src tag (I couldn't easily swap out such images in Stampready either) they need to be handled separately.
  3. data-size/data-color/data-border-color (or border's individual variant) :
     1. Get all with [data-size]/[data-color]/[data-border-color]
     2. Same as priors
     3. Same as priors
     4. This time, in same nodes, handlebars need to be added inside the inline style attribute's `font-size:{{here}};` or `color:{{here}}`
     - If required, font-family can be managed for each of these bad bois, too (Since most font-fam are bundled in same style tags).
  4. data-link-size/data-link-color:
     1. Get all with with [data-link-size]/[data-link-color]
     2. Same as #3
     3. same as #3
     4. Semi-same as #3, but also need to handlebar styles for a possible descendant <a> tag
  5. <singleline>, <multiline>
     1. Get all by querying the tag.
     2. Replace innerText w/ handlebars whose prop name comes from [label] attribute for this node.
     3. (Obviously change ui schema's widget based on which one it is).
     4. Something to note is all editables' direct parent td tag has a [editable] attribute to it which could also be a candidate for prop name
  6. <img>
     1. Get all by querying the tag.
     2. Use their width to tell widget how much to ask server to resize for.
     3. Use mc:edit (it's directly img tag's attribute here) for prop name (label is bad in Matah template)
     4. Add handlebars for src
- Global Settings:
  - Might be worth having a way to 'select' blocks in frontend and have their common props (same name and type) be populated to edit in global settings UI.
  - The way Stampready does it is unituitive, and leaves me unsure as to what exactly changes when updating after selecting 'Effect all Modules.' (Coz most of the things don't work as u'd expect)
