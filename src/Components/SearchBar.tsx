import {Button, Form} from 'react-bulma-components'
import { Form as RDForm} from "react-router-dom";

import React from "react";

export function SearchBar() {
  return <>
    <RDForm method={"get"} action={""}>
      <Form.Field kind="addons">
        <Form.Control>
          <Form.Input
            placeholder="Screen name"
            type="search"
            name="screen_name"
            value={"temp"}
            onChange={handleChange}
          />
        </Form.Control>
        <Form.Control>
          <Button color="info" onClick={handleSearch} type={"submit"}>
            Search
          </Button>
        </Form.Control>
      </Form.Field>
    </RDForm>
  </>
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  // TODO
}

const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
  // TODO
}