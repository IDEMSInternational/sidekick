# Set up
## Doc (Google Docs)
### Link to Google Sheet

This is done by the first table within the Doc. This table must hold the Sheet id for the corresponding Sheet within cell(1,1) - 2nd Column, 2nd Row

i.e.

| METADATA      |                 |
| ------------- | ----------------|
| Sheet         | [Sheet ID here] |


### Sheet
The sheet must contain a worksheet called docJSON and have valid JSON in A1. 

[valid JSON](https://github.com/IDEMSInternational/sidekick/blob/main/example/sheet.json)


# Editing content
All content can be added directly within the document without using the side menu. To make sure this is done safely a few rules must be followed.
- Articles must have a unique id/name that is of type **Heading1**
- Article headers must be directly followed by a table that contains the article data
- Section Types must be of type **Subtitle**
- Section data must be within a table under the Section Subtitle
- The first column of all data tables must contain the field names
- The first table must be the METADATA table as mentioned in **Set up**