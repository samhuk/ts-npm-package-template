COMPONENT_NAME_PASCAL_CASE_SEARCH=MyComponent
COMPONENT_NAME_DASH_CASE_SEARCH=my-component

# Edit these with your desired name
COMPONENT_NAME_PASCAL_CASE=DataTable
COMPONENT_NAME_DASH_CASE=data-table
NPM_PACKAGE_NAME=data-table

echo Renaming all occurances of $COMPONENT_NAME_PASCAL_CASE_SEARCH with $COMPONENT_NAME_PASCAL_CASE

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/component/index.ts

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/component/types.ts

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/client/components/home.tsx

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/client/components/body.tsx
sed -i "s/$COMPONENT_NAME_DASH_CASE_SEARCH/$COMPONENT_NAME_DASH_CASE/g" src/client/components/body.tsx

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/client/components/showcase/myComponent.tsx

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/client/components/showcase/index.tsx
sed -i "s/$COMPONENT_NAME_DASH_CASE_SEARCH/$COMPONENT_NAME_DASH_CASE/g" src/client/components/showcase/index.tsx

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/client/components/common/generic/myComponent.tsx

sed -i "s/$COMPONENT_NAME_PASCAL_CASE_SEARCH/$COMPONENT_NAME_PASCAL_CASE/g" src/client/components/header/index.tsx

sed -i "s/$COMPONENT_NAME_DASH_CASE_SEARCH/$NPM_PACKAGE_NAME/g" package.json

echo Done!