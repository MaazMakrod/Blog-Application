import * as React from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import CopyrightSharpIcon from '@mui/icons-material/CopyrightSharp'
import styled from 'styled-components'
// import { positions } from '@mui/system'

const Footer = styled.div`
    background-color: #1976d2;
    textAlign: center;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 0.8;
`

export default function SimpleBottomNavigation() {
  return (
    <Footer>
      <BottomNavigation
        showLabels
        value={0}
      >
        <BottomNavigationAction label="Maaz Makrod, 2022" icon={<CopyrightSharpIcon />} />
      </BottomNavigation>
    </Footer>
  )
}