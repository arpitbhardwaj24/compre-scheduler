import React, { createContext, useContext, useEffect } from 'react';
import { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import BlockTarget from './BlockTarget';
import Block from './Block';
import '../App.css';
import { BlockContext } from '../App';
import { Style } from '@material-ui/icons';

export const TableContext = createContext({
	deleteFromTarget: null,
	addToTarget: null,
	unallotInvigilator: null,
	updateInvigilator: null
});

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: '#7986CB',
		color: theme.palette.common.white,
		minWidth: 200,
		borderRight: '1px solid white'
	},
	body: {
		fontSize: 14,
		width: 200,
		padding: 0,
		height: 300,
		borderRight: '1px solid grey',
		borderBottom: '1px solid grey'
	}
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {}
}))(TableRow);

const useStyles = makeStyles({
	table: {
		minWidth: 700,
		minHeight: 'calc(100vh - 64px)',
		overflow: 'auto'
	}
});

export default function CustomizedTables() {
	const classes = useStyles();

	const { deleteBlock, dates, rows, setRows } = useContext(BlockContext);

	// console.log(dates);
	useEffect(() => {
		console.log(rows);
	}, [rows]);

	const deleteFromTarget = (name, row, col) => {
		const blocks = rows[row].data[col];
		let newBlocks;
		blocks.forEach((data, i) => {
			data.courses?.forEach((course, j) => {
				if (course.name === name) {
					let modBlocks = blocks.filter((el, index) => {
						return index !== i;
					});
					let modCourses = blocks[i].courses.filter((el, index) => {
						return index !== j;
					});
					newBlocks = [...modBlocks, { courses: modCourses }];
				}
			});
		});
		let newRows = [...rows];
		newRows[row].data[col] = newBlocks;
		console.log(newBlocks);
		setRows(newRows);
	};

	const addToTarget = (course, row, col) => {
		const blocks = rows[row].data[col];
		let newBlocks;
		if (blocks.length === 0) newBlocks = [{ courses: [course] }];
		blocks.forEach((data, i) => {
			if (data.courses && data.courses[0]?.slot === course.slot) {
				let modBlocks = blocks.filter((el, index) => {
					return index !== i;
				});
				let modCourses = [...blocks[i].courses, course];
				newBlocks = [...modBlocks, { courses: modCourses }];
			} else if (i === blocks.length - 1) {
				newBlocks = [...blocks, { courses: [course] }];
			}
		});

		let newRows = [...rows];
		newRows[row].data[col] = newBlocks;
		setRows(newRows);
	};

	const unallotInvigilator = (row, col, data, index) => {
		console.log(row);
		console.log(col);
		const blocks = rows[row].data[col];
		const newBlocks = blocks;
		console.log(newBlocks);
		newBlocks.forEach((block, i) => {
			if (block.courses && block.courses[0]?.slot === data.slot) {
				console.log(block);
				block.courses.forEach((course, j) => {
					if (data.name === course.name) {
						let newAllotedArray = course.allotedInvigilators;
						newAllotedArray.splice(index, 1);
						course.allotedInvigilators = newAllotedArray;
						console.log(course);
						console.log(index);
						// course.recommendedInvigilators = course.recommendedInvigilators.filter(
						//   (el) => {
						//     console.log(el);
						//     console.log(invigilator);
						//     return !(el === invigilator);
						//   }
						// );
					}
				});
			}
		});

		let newRows = [...rows];
		newRows[row].data[col] = newBlocks;
		setRows(newRows);
		console.log(rows);
	};

	const updateInvigilator = (row, col, data, index, invi) => {
		console.log(row);
		console.log(col);
		const blocks = rows[row].data[col];
		const newBlocks = blocks;
		console.log(newBlocks);
		newBlocks.forEach((block, i) => {
			if (block.courses && block.courses[0]?.slot === data.slot) {
				console.log(block);
				block.courses.forEach((course, j) => {
					if (data.name === course.name) {
						let newAllotedArray = course.allotedInvigilators;
						newAllotedArray[index] = invi;
						course.allotedInvigilators = newAllotedArray;
						console.log(course);
						console.log(index);
						// course.recommendedInvigilators = course.recommendedInvigilators.filter(
						//   (el) => {
						//     console.log(el);
						//     console.log(invigilator);
						//     return !(el === invigilator);
						//   }
						// );
					}
				});
			}
		});

		let newRows = [...rows];
		newRows[row].data[col] = newBlocks;
		setRows(newRows);
		console.log(rows);
	};

	const allotInvigilator = (row, col, data, invigilator) => {
		const blocks = rows[row].data[col];
		const newBlocks = blocks;
		console.log(newBlocks);
		newBlocks.forEach((block, i) => {
			if (block.courses && block.courses[0]?.slot === data.slot) {
				console.log(block);
				block.courses.forEach((course, j) => {
					if (data.name === course.name) {
						course.allotedInvigilators.push(invigilator);
						// course.recommendedInvigilators = course.recommendedInvigilators.filter(
						//   (el) => {
						//     console.log(el);
						//     console.log(invigilator);
						//     return !(el === invigilator);
						//   }
						// );
					}
				});
			}
		});

		let newRows = [...rows];
		newRows[row].data[col] = newBlocks;
		setRows(newRows);
		console.log(rows);
	};

	return (
		<TableContext.Provider
			value={{
				deleteFromTarget,
				addToTarget,
				unallotInvigilator,
				updateInvigilator
			}}
		>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell width="100px">Slot</StyledTableCell>
							{dates.map((el) => (
								<StyledTableCell align="center">{el.formattedDate}</StyledTableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows?.map((row, i) => (
							<StyledTableRow key={row.name}>
								<StyledTableCell
									width="100px"
									component="th"
									scope="row"
									style={{
										padding: 20,
										background: '#9FA8DA33',
										borderLeft: '2px solid #9FA8DA'
									}}
								>
									{row.name}
								</StyledTableCell>
								{row.data?.map((blocks, j) => (
									<StyledTableCell>
										<BlockTarget row={i} col={j}>
											{blocks?.map((group) => {
												return group.courses?.length ? (
													<div
														style={{
															border: '1px solid #9FA8DA',
															margin: 10,
															background: '#9FA8DA33',
															paddingBottom: 2
														}}
													>
														<div
															style={{
																background: '#9FA8DA',
																textAlign: 'left',
																padding: 5,
																color: 'white'
															}}
														>
															{group.courses[0].slot}
														</div>
														{group.courses.map((el) => {
															return (
																<Block
																	data={el}
																	allotInvigilator={allotInvigilator}
																	unallotInvigilator={unallotInvigilator}
																	row={i}
																	col={j}
																/>
															);
														})}
													</div>
												) : null;
											})}
										</BlockTarget>
									</StyledTableCell>
								))}
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</TableContext.Provider>
	);
}
