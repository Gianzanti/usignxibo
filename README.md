# XIBO API

Node module to consume the Xibo CMS API

## Installation

```js
npm add usignxibo
```

## Usage

On your Xibo CMS server, navigate to the Application page and click the 'Add Application' button to get the Client ID and Client Secret needed to authenticate in the API

With this information you can start consuming the api making the first connection to the server:

```ts
const xibo = new Xibo({
  url,
  client_id: conn.client_id,
  client_secret: conn.client_secret,
  grant_type: "client_credentials",
});
if (await xibo.authenticate()) {
  return xibo;
}
```

### Managing Xibo Tags

Follow the documentation on Xibo CMS API to know all the available resources (<https://xibo.org.uk/manual-tempel/api/#/tags>)

To list/search tags

```ts
const allTags = await xibo.tags.list();
```

To search using any tag search criteria (see the TagCriteria interface)

```ts
const tags = await xibo.tags.list({ tagId: 5 });
```

To add a new tag

```ts
const newTag = await xibo.tags.insert({
  name: "TagName",
});
```

To update a existing tag (using the newTag created above)

```ts
const updatedTag = await newTag.save({
  ...newTag,
  name: "TagNameChanged",
});
```

To delete a tag (using the updatedTag created above)

```ts
const removed = await updatedTag.delete();
```

### Managing Xibo DisplayGroups

Follow the documentation on Xibo CMS API to know all the available resources (<https://xibo.org.uk/manual-tempel/api/#/displayGroup>)

To list/search tags

```ts
const allDisplayGroups = await xibo.displaygroups.list();
```

To search using any displayGroup search criteria (see the DisplayGroupCriteria interface)

```ts
const displaygroups = await xibo.displaygroups.list({ tagId: 5 });
```

To add a new displayGroup

```ts
const newDG = await xibo.displaygroups.insert({
  displayGroup: `DG_Name`,
  isDynamic: 0,
});
```

To update a existing displayGroup (using the newDG created above)

```ts
const updDG = await newDG.save({
  ...newDG,
  name: "DG_NameChanged",
});
```

To insert an existing display to the displayGroup

```ts
const displayID = 1;
await updDG.addDisplays(displayID);
```

To remove a display from the displayGroup

```ts
const displayID = 1;
await updDG.removeDisplays(displayID);
```

To insert another displayGroup as a member of the displayGroup

```ts
const anotherDisplayGroup = 1;
await updDG.addDisplayGroups(anotherDisplayGroup);
```

To remove a displayGroup as member of the displayGroup

```ts
const anotherDisplayGroup = 1;
await updDG.removeDisplayGroups(anotherDisplayGroup);
```

To delete a displayGroup (using the updDG created above)

```ts
const removed = await updDG.delete();
```
