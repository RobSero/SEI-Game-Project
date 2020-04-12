function init() {
 
  const grid = document.querySelector('.grid')
  const width = 10
  const cellCount = width * width
  const cells = []

  const scoreDisplay = document.getElementById('score-display')
  const body = document.body


  // -------------------------------------------------------CREATE BOARD -------------------------------------- //

  function createCells(){
    for (let i = 0; i < cellCount; i++){
      const cell = document.createElement('div')
      cell.setAttribute('id', i)
      cell.textContent = i
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  createCells()






}

window.addEventListener('DOMContentLoaded', init)