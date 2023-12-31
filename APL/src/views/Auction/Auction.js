import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles"
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
// import Table from "components/Table/Table.js";
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
//import ReactToolTip from "react-tooltip";

// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import DoneIcon from '@material-ui/icons/Done';
// import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
// import NavigateNextIcon from '@material-ui/icons/NavigateNext';
//import Container from "@material-ui/core/Container";
// import Select from "@material-ui/core/Select";
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import Drawer from '@material-ui/core/Drawer';
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import IconButton from '@material-ui/core/IconButton';
// import CheckSharpIcon from '@material-ui/icons/CheckSharp';
// import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import InfoIcon from '@material-ui/icons/Info';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import Input from '@material-ui/core/Input';
import Avatar from "@material-ui/core/Avatar"
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import { DisplayMyPlayers, BlankArea, NoGroup, JumpButtonFull, DisplayPageHeader, MessageToUser, ShowTeamImage, DisplayCancel } from 'CustomComponents/CustomComponents.js';
import { UserContext } from "../../UserContext";
import socketIOClient from "socket.io-client";
import { hasGroup, getAuctionCountDown, getImageName } from 'views/functions';
import {blue, green, orange, deepOrange}  from '@material-ui/core/colors';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";

import { uniqBy } from 'lodash';

const PLAYCOUNTDOWNAUDIO=false;
const PLAYCLICKAUDIO=true;
 
const drawerWidth = 100;
const useStyles = makeStyles((theme) => ({
    infoButton: {
        backgroundColor: '#FCDC00',
        ":disabled": {
            backgroundColor: '#cddc39',
        }
    },
    margin: {
        margin: theme.spacing(1),
    },
    hdrText:  {
        // right: 0,
        // fontSize: '12px',
        // color: red[700],
        // // position: 'absolute',
        align: 'center',
        marginTop: '0px',
        marginBottom: '0px',
    },
    image: {
        height: "200px"
    },
    bidButton: {
        padding: "4px"
    },
    container: {
        backgroundImage: `url(${process.env.PUBLIC_URL}/0.JPG)`,
        backgroundSize: 'cover'
    }, 
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    },
    sold: {
        color: "green"
    }, 
    noPlayerMsg: {
        color: green[700],
        fontSize: "14px",
        fontWeight: theme.typography.fontWeightBold
    }, 
    countDownMessage: {
        color: green[700],
        fontSize: "14px",
        fontWeight: theme.typography.fontWeightBold
    }, 
    countDownBigMessage: {
        color: green[700],
        fontSize: "24px",
        fontWeight: theme.typography.fontWeightBold
    }, 
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "0px",
        textDecoration: "none"
    }, 
    large: {
        width: theme.spacing(12),
        height: theme.spacing(12),
    },
    medium: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    },
    playerinfo: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 0),
        justifyContent: 'flex-start',
    },
    th: { 
        spacing: 0,
        align: "center",
        padding: "none",
        backgroundColor: '#EEEEEE', 
        color: deepOrange[700], 
        // border: "1px solid black",
        fontWeight: theme.typography.fontWeightBold,
      },
    td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
    },    
    modalContainer: {
        content: "",
        opacity: 0.8,
        // background: rgb(26, 31, 41) url("your picture") no-repeat fixed top;
        // background-blend-mode: luminosity;
        /* also change the blend mode to what suits you, from darken, to other 
        many options as you deem fit*/
        // background-size: cover;
        // top: 0;
        // left: 0;
        // right: 0;
        // bottom: 0;
        // position: absolute;
        // z-index: -1;
        // height: 500px;
    },
    modalTitle: {
        color: blue[700],
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightBold,
    },
    modalMessage: {
        //color: blue[700],
        fontSize: theme.typography.pxToRem(14),
        //fontWeight: theme.typography.fontWeightBold,
    },
        modalbutton: {
        margin: theme.spacing(2, 2, 2),
    },
    
}));


  
function leavingAuction(myConn) {
  //console.log("Leaving Auction wah wah ");
  myConn.disconnect();
}
  
  
let arunCancel = false;
let MAXCOUNTDOWN = parseInt(process.env.REACT_APP_AUCTIONCOUNTDOWN);


export default function Auction() {
		const gClasses = globalStyles();
    //window.onbeforeunload = () => setUser(null)
    
    const classes = useStyles();
    const theme = useTheme();
    const [playerId, setPid] = useState(0);
    const [auctionStatus, setAuctionStatus] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerImage, setPlayerImage] = useState("");
    const [team, setTeam] = useState("");
    const [role, setRole] = useState("");
    const [battingStyle, setBattingStyle] = useState("");
    const [bowlingStyle, setBowlingStyle] = useState("");
    const [bidPaused, setBidPaused] = useState(true);
  
    const [expandedRole, setExpandedRole] = useState("");
    
    const [bidAmount, setBidAmount] = useState(0);
    const [bidUser, setBidUser] = useState("");
    const [bidUid, setBidUid] = useState(0);
    
    const [interested, setInterested] = useState(true);
    // const [bidOverMsg, setBidOverMsg] = useState("");
    // const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
    // const [selectedOwner, setSelectedOwner] = useState(null);
    const [backDropOpen, setBackDropOpen] = useState(false);
    const [playerStatus, setPlayerStatus] = useState("");
    const [AuctionTableData, setAuctionTableData] = useState([]);
    const [myBalanceAmount, setMyBalanceAmount] = useState(0);
    const [countDown, setCountDown] = useState(0);
    const [noPlayerMessage, setNoPlayerMessage] = React.useState("");


    const [soldDrawer, setSoldDrawer] = React.useState("");
    const [infoDrawer, setInfoDrawer] = React.useState("");
    const [inPageData, setInPageData] = React.useState([]);
    const [totalMembers, setTotalMembers] = React.useState(0);
		const [maxPlayers, setMaxPlayers] = React.useState(0);
    const [modalIsOpen,setIsOpen] = React.useState(false);
    function isModalOpen() { return modalIsOpen}
    function openModal() { setIsOpen(true); }
    function closeModal() { setIsOpen(false); }
    function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
    }
    

    function DisplayBidOverMsg(msg) {
        setPlayerStatus(msg);
        // setConfirmDialogOpen(false);
        setBackDropOpen(true); 
        setTimeout(() => setBackDropOpen(false), process.env.REACT_APP_MESSAGE_TIME);       
    }

    // console.log(`Dangerous ${playerId}`)
    useEffect(() => {
			// console.log(process.env.PUBLIC_URL);
      //console.log("I am " + localStorage.getItem("userName"));
			var sendMessage = {page: "AUCT", gid: localStorage.getItem("gid"), uid: localStorage.getItem("uid"), userName: localStorage.getItem("userName"), interested: true };
			var sockConn = socketIOClient(process.env.REACT_APP_ENDPOINT);

			const makeconnection = async () => {
				await sockConn.connect();
				sockConn.emit("page", sendMessage);
			}

			function updatePlayerChange(newPlayerDetails, balanceDetails) {
					//console.log(balanceDetails);
					setBidPaused(false);
					// console.log("Player Changed");
					// console.log(`New: ${newPlayerDetails.pid}  Old: ${playerId} `)
					// first set PID so that display is better
					setPid(newPlayerDetails.pid)
					// let tmp = `${process.env.PUBLIC_URL}/${newPlayerDetails.pid}.JPG`
					let tmp = `https://www.cricapi.com/playerpic/${newPlayerDetails.pid}.JPG`
					if (playerImage != tmp) {
							// console.log("Different image")
							// setPlayerImage(`${process.env.PUBLIC_URL}/${newPlayerDetails.pid}.JPG`);
							setPlayerImage(tmp);
					} else {
							// console.log("Same player image")
					}
					setTeam(newPlayerDetails.Team)
					setRole(newPlayerDetails.role)
					setBattingStyle(newPlayerDetails.battingStyle)
					setBowlingStyle(newPlayerDetails.bowlingStyle)
					setPlayerName(newPlayerDetails.fullName)

					let ourBalance = balanceDetails.filter(x => x.uid == localStorage.getItem("uid"))
					//console.log(ourBalance);
					setMyBalanceAmount(ourBalance[0].balance);
					// for ADMIN, NOW WE WILL SHOW BALANCE of himself/herself. Not of other members
					// let allUserBalance = (localStorage.getItem("admin") === "false") ? ourBalance : balanceDetails;
					let allUserBalance = ourBalance;
					setAuctionTableData(allUserBalance);
					setAuctionStatus("RUNNING");
        }

			makeconnection();    
			sockConn.on("connect", () => {
        sockConn.emit("page", sendMessage);

        sockConn.on("auctionStatus", (newAuctionStatus) => {
          console.log(`auction status: ${newAuctionStatus}`);
          setAuctionStatus(newAuctionStatus);
        });

        sockConn.on("noPlayer", (message) => {
          console.log(`Rcbd no player aauction status`);
          setNoPlayerMessage("All players purchased during Auction");
          setAuctionStatus("OVER");
        });

        sockConn.on("countDown", (message) => {
            console.log(message);
            let myCountdown = message.countDown;
            if (localStorage.getItem("admin").toLowerCase() === "true") {
                //console.log("Cancel", arunCancel, message.countDown);
                if (arunCancel) 
                    myCountdown = 0;
            }
						if (myCountdown > 0) setSoldDrawer("SOLD");
						else                 setSoldDrawer("");
						
            //console.log("mycount", myCountdown);
            setCountDown(myCountdown);
            if (PLAYCOUNTDOWNAUDIO) {
                if (myCountdown > 0) {
                    let countMp3 = `${process.env.PUBLIC_URL}/audio/${myCountdown}.MP3`;
                    let audioClick = new Audio(countMp3);
                    audioClick.play();
                }
            }
        });

        sockConn.on("bidOver", (myrec) => {
          console.log("bid over received");
          console.log(myrec);
          DisplayBidOverMsg(`${myrec.playerName} successfully purchased by ${myrec.userName}`);
          setInterested(true);
        });
        sockConn.on("newBid", (grec) => {
            console.log("---------------- new bid");
            arunCancel = true;
            setCountDown(0);        
            setBidAmount(grec.auctionBid);
            setBidUser(grec.currentBidUser);
            setBidUid(grec.currentBidUid);
            if (PLAYCLICKAUDIO) {
                let clickMp3 = `${process.env.PUBLIC_URL}/audio/CLICK.MP3`;
                let audioClick = new Audio(clickMp3);
                audioClick.play();    
            }
        });
        sockConn.on("playerChange", async (newPlayerDetails, balanceDetails) => {
            // console.log("Calling updatePlayerChange from socker");
            updatePlayerChange(newPlayerDetails, balanceDetails);
        });

        sockConn.on("inAuction", (arein) => {
          //console.log(arein);
          let tmp = uniqBy(arein, 'uid');
          setInPageData(tmp);
          //tmp = tmp.find(x => x.uid == localStorage.getItem("uid");
          //if (tmp.interested !== 
      });

        })

			const a = async () => {
          //console.log("in async");
					if (!hasGroup()) return;
					var response;
					
          
					// get maximum players for this group
					response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/getmaxplayers/${localStorage.getItem("gid")}`);
					setMaxPlayers(response.data.maxPlayers);
					
					// get details
          //console.log("getting auction status");
					response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/getauctionstatuswithuid/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}`);
					//console.log(response.data)
					setAuctionStatus(response.data.status);
          
          //console.log(response.data.inPageCount.total);
          setTotalMembers(response.data.inPageCount.total);
          
					if (response.data.status === "RUNNING") {
							// get current player details
							//same as when data rcvd in socket msg playerChange
							const response2 = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/current/${localStorage.getItem("gid")}`)
							// console.log("Calling updatePlayerChange from currentr");
							updatePlayerChange(response2.data.a, response2.data.b);
							// get whi has bidded
							const response1 = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/getbid/${localStorage.getItem("gid")}`);
							// console.log("GETBID");
							// console.log(response1.data)
							if (response1.status === 200) {
									setBidAmount(response1.data.auctionBid)
									setBidUser(response1.data.currentBidUser);
									setBidUid(response1.data.currentBidUid);            
							}
					}

					MAXCOUNTDOWN = await getAuctionCountDown();
			}
			const allOver = async () => {
        //let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/leavingauction/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}`;
        //console.log(myURL);
        //await axios.get(myURL);
				leavingAuction(sockConn);
      }
			a();

      
			return () => {
        allOver();
			}
    }, []);

    

    async function finallySellPlayer() {
        setBidPaused(true);
        let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/auction/add/${localStorage.getItem("gid")}/${bidUid}/${playerId}/${bidAmount}`
        // console.log(myUrl);
        let response = await fetch(myUrl);
        if (response.status == 200) {
            // console.log("getting balance");
            // const balance = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/balance/${localStorage.getItem("gid")}/all`);
            // setAuctionTableData(balance.data);
        } else {
            var msg = "";
            switch (response.status) { 
                case 707: msg = "Already Purchased"; break;
                case 706: msg = "User does not belong to this group"; break;
                case 704: msg = "Invalid Player"; break;
                case 708: msg = "Insufficient Balance"; break;
                // case 200: msg = `${playerName} purchsed by ${bidUser} by bid amount ${bidAmount}`; break;
                default:  msg = `unknown error ${response.status}`; break;
            }
            DisplayBidOverMsg(msg);
        }
    }

    async function sellplayer(count) {
        if (count === MAXCOUNTDOWN) {
            setSoldDrawer("SOLD");
            setBidPaused(true);
            arunCancel = false;
        } else {
            if (arunCancel) { 
                count = 0; 
                setSoldDrawer("");
                //arunCancel = false;  
                setCountDown(0) 
            }
        }
    
        try {
            await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/countdown/${localStorage.getItem("gid")}/${count}`);
            if (count > 0) setTimeout(() => sellplayer(count-1), 1000);
            else  {
                if (arunCancel) {
                    setSoldDrawer("");
                    setBidPaused(false);
                    arunCancel = false;
                } else {
                    //console.log("time to send sell message");
                    setSoldDrawer("");
                    await finallySellPlayer();
                }
                
            }
        } catch (e) {
            console.log("Unable to send countdown");
            console.log(e);
            setBidPaused(false);
            setCountDown(0);
        }
    }

    function handleAuctionOver() {
			console.log("Over pressed");
		  openModal(); 
    }

    async function handleAuctionOverConfirm() {
      console.log("Call Here");
      closeModal();
      return;
      
        const response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setauctionstatus/${localStorage.getItem("gid")}/OVER`);
        if (response.data) {
					closeModal();
					setAuctionStatus("OVER");
        }
    }

    async function skipPlayer() {
        setBidPaused(true);
        await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/skip/${localStorage.getItem("gid")}/${playerId}`);
    }

    function ShowCountDown() {
        // console.log("About to show cd:",countDown);
        if (countDown > 0) 
            return (
                <div align="center">
                <Typography className={classes.countDownBigMessage}>{countDown}</Typography>
                <Typography className={classes.countDownMessage}>Player will be sold in {countDown} seconds</Typography>
                </div>
            );
        else 
            return null;
    }

    async function toggleInterested() {
      var newState = !interested
      setInterested(newState);
      axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/notinterested/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}/${newState}`);
    }
    

/*
            <Grid container justify="center" alignItems="center" >
                <GridItem xs={1} sm={1} md={3} lg={3} />
                <GridItem xs={7} sm={7} md={6} lg={6} >
                  <Typography align="center" >
                    <span className={gClasses.info18Brown} >{notInterrestedCount}/{totalMembers} not interested</span>
                    <span><InfoIcon style={{color: 'blue', marginLeft: "5px" }} size="small" onClick={() => { setInfoDrawer("RUNNING"); } } /></span>
                  </Typography>
                </GridItem>
                <GridItem xs={4} sm={4} md={3} lg={3} >
                  <VsButton name={(interested) ? "Not Interested" : "Interested"} align="center" onClick={toggleInterested} />
                </GridItem>
                <GridItem xs={12} sm={12} md={12} lg={12} >
                    <ShowPlayerAvatar pName={playerName} pImage={playerImage} pTeamLogo={team} /> 
                    <ShowCountDown />
                    <ShowValueButtons />
                    <ShowAdminButtons/>
                </GridItem>
            </Grid>
						<br />

*/
    
    function DisplayRunningAuction() {
        // console.log(`Pid from admin auction ${playerId}`)
        //var inPageCount = inPageData.length;
        //console.log(inPageData);
        var notInterrestedCount = inPageData.filter(x => x.interested == false).length;
        console.log(notInterrestedCount);
        var myText = (notInterrestedCount > 0) ? `${notInterrestedCount}/${totalMembers} not interested` : "All are interested";
        var myInfo = "";
        if (notInterrestedCount > 0)
        for(var i=0; i<inPageData.length; ++i) {
          if (!inPageData[i].interested) {
            myInfo += inPageData[i].userName + "<br />";
          }
        }
        return (
          <div align="center" className={gClasses.root}>
            <Grid container justify="center" alignItems="center" >
              <GridItem xs={1} sm={1} md={3} lg={3} />
              <GridItem xs={7} sm={7} md={6} lg={6} >
                <Typography align="center" >
                  <span className={gClasses.info18Brown} >{myText}</span>
                    {(notInterrestedCount > 0) &&
                      <span className={gClasses.info18Brown} ><InfoIcon style={{color: 'blue', marginLeft: "5px" }} color="primary" size="small" onClick={() => setInfoDrawer("RUNNING") } /></span>
                    }
                </Typography>
              </GridItem>
              <GridItem xs={4} sm={4} md={3} lg={3} >
                <VsButton name={(interested) ? "Not Interested" : "Interested"} align="center" onClick={toggleInterested} />
              </GridItem>
              <GridItem xs={12} sm={12} md={12} lg={12} >
                <ShowPlayerAvatar pName={playerName} pImage={playerImage} pTeamLogo={team} /> 
                  {/*<ShowCountDown />*/}
                <ShowValueButtons />
                <ShowAdminButtons/>
              </GridItem>
            </Grid>
						<br />          
            <ShowAuctionOverButton/>
						<br />
            <ShowBalance/>
            <MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={playerStatus} />
              {/*<Tooltip align="left" className={gClasses.patientInfo2Brown} key="RUNNING" type="info" effect="float" id="RUNNING" multiline={true}/>*/}
        </div>
        );
    }

    function ShowPlayerAvatar(props) {
        if (props.pTeamLogo === "") return null;
    
        // let myTeam = `${process.env.PUBLIC_URL}/${props.pTeamLogo}.JPG`
        // myTeam = myTeam.replaceAll(" ", "");
        let myTeam = getImageName(props.pTeamLogo);    
        //console.log("Team", myTeam);

        return (
            <div key="playerInfo">
                <Card profile>                    
                    <CardAvatar profile>
										{/*<img src={props.pImage} alt="..." />*/}
                    </CardAvatar>
                    <CardBody profile>
                        {/* <h6 className={classes.cardTitle}>{props.pName}</h6> */}
													{/*<h6 className={classes.hdrText}>{props.pName}</h6>*/}
												<br />
												<Typography className={gClasses.info22}>{props.pName}</Typography>
                        <Grid container justify="center" alignItems="left">
													<GridItem xs={4} sm={4} md={4} lg={4} direction="column" align="left" style={{ display: "flex", justifyContent: "flex-end" }}>
                            <Avatar variant="square" src={myTeam} className={classes.medium} />
														<Typography className={gClasses.info10}>{props.pTeamLogo}</Typography>
													</GridItem>
													<GridItem justifyContent="flex-end" xs={8} sm={8} md={8} lg={8} direction="column" align="left" style={{ display: "flex", justifyContent: "flex-end" }}>
														<Typography className={gClasses.info18Bold}>Player Info</Typography>
														<Typography className={gClasses.info2}>Role: {role}</Typography>
														<Typography className={gClasses.info2}>Batting: {battingStyle}</Typography>
														<Typography className={gClasses.info2}>Bowling: {bowlingStyle}</Typography>
													</GridItem>
                        </Grid>
                        <div align="center">
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

  function DisplayPlayersByRole(props) {
  var myPlayers = AuctionTableData[0].players.filter(x => x.role === props.role);
  var myCount = "( " +  myPlayers.length + " player(s) )";
  return (
  <Accordion className={gClasses.fullWidth} key={props.role} expanded={expandedRole === props.role} onChange={() => handleAccordionChange(props.role)}>
    <AccordionSummary key={props.role} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
			<Typography className={gClasses.info2}>{props.desc} ( {pText} )</Typography>
    </AccordionSummary>    
    <AccordionDetails>
      <Table key={props.role} >
      <TableHead p={0}>
        <TableRow align="center">
          <TableCell className={gClasses.patientInfo2Brown} p={0} align="left">Team</TableCell>
          <TableCell className={gClasses.patientInfo2Brown} p={0} align="center">Player</TableCell>
          <TableCell className={gClasses.patientInfo2Brown} p={0} align="center">Bid Amount</TableCell>      
        </TableRow>
      </TableHead>
      <TableBody>
        {myPlayers.map(item => {
          return (
            <TableRow align="center" key={item.playerName} >
              <TableCell  align="center" className={gClasses.info2} p={0} align="center" >
                <ShowTeamImage teamName={item.team} />
              </TableCell>
              <TableCell  align="center" className={gClasses.info2} p={0} align="center" >
                {item.playerName}
              </TableCell>
              <TableCell className={gClasses.info2} p={0} align="center" >
                {item.bidAmount}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody> 
      </Table>
    </ AccordionDetails>
    </Accordion>

    )}
    
    
		function Org_ShowBalance() {
				if (AuctionTableData.length == 0) return null;
				if (!AuctionTableData[0].players) return null;
				//console.log(AuctionTableData[0].players);
				var myBalance = AuctionTableData[0].balance;
				var myPurchaseCount = AuctionTableData[0].players.length;
        return (
					<div>
						<Typography className={gClasses.patientInfo2Blue} >{`Balance amount: ${myBalance}`}</Typography> 
						{/*(myPurchaseCount == 0) &&
							<Typography className={gClasses.info2} align="center" >No Players yet purchased</Typography>
						*/}
						{(true) &&
						  <div align="center">
							<Typography className={gClasses.info2} >{`${myPurchaseCount} players purchased.`}</Typography>
							<Typography className={gClasses.info2} >{`Maximum ${maxPlayers} players can be purchased.`}</Typography>
							</div>
						}
            <Table>
            <TableHead p={0}>
                <TableRow align="center">
								<TableCell className={gClasses.patientInfo2Brown} p={0} align="left">Team</TableCell>
                <TableCell className={gClasses.patientInfo2Brown} p={0} align="center">Player</TableCell>
                <TableCell className={gClasses.patientInfo2Brown} p={0} align="center">Bid Amount</TableCell>      
                </TableRow>
            </TableHead>
            < TableBody p={0}>
								{/*(AuctionTableData[0].players.length == 0) &&
									<TableRow align="center" key="norow">
										<TableCell colSpan={3} className={gClasses.info2} p={0} align="center" >
											No Players yet purchased
										</TableCell>
									</TableRow>
								*/}
                {AuctionTableData[0].players.map(item => {
                  return (
                    <TableRow align="center" key={item.playerName}>
											<TableCell  align="center" className={gClasses.info2} p={0} align="center" >
                        <ShowTeamImage teamName={item.team} />
                      </TableCell>
                      <TableCell  align="center" className={gClasses.info2} p={0} align="center" >
                        {item.playerName}
                      </TableCell>
                      <TableCell className={gClasses.info2} p={0} align="center" >
                        {item.bidAmount}
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody> 
            </Table>
					</div>
        );
    }

  function handleAccordionChange(panel) {
    //console.log("100", event, isExpanded, panel );
    setExpandedRole((expandedRole != panel) ? panel : "");
  };
  
		function ShowBalance() {
      if (AuctionTableData.length == 0) return null;
      if (!AuctionTableData[0].players) return null;
      //console.log(AuctionTableData[0].players);
      var myBalance = AuctionTableData[0].balance;
      var myPurchaseCount = AuctionTableData[0].players.length;
      var allBatsman = AuctionTableData[0].players.filter(x => x.role === "Batsman");
      var allBowler = AuctionTableData[0].players.filter(x => x.role === "Bowler");
      var allAllRounder = AuctionTableData[0].players.filter(x => x.role === "AllRounder");
      var allWk = AuctionTableData[0].players.filter(x => x.role === "Wk");
      return (
        <div align="center">
          <Typography className={gClasses.patientInfo2Blue} >{`Balance amount: ${myBalance}`}</Typography> 
          <Typography className={gClasses.info2} >{`${myPurchaseCount} players purchased.`}</Typography>
          <Typography className={gClasses.info2} >{`Maximum ${maxPlayers} players can be purchased.`}</Typography>
           <Accordion key="Batsman" expanded={expandedRole === "Batsman"} onChange={() => handleAccordionChange("Batsman")}>
              <AccordionSummary className={gClasses.whiteAccordian} key={"ASS"+"Batsman"} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={gClasses.patientInfo2}>{"Batsman ( " + allBatsman.length + " player(s) )"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DisplayMyPlayers players={allBatsman} />
              </ AccordionDetails>
            </Accordion>
            <Accordion key="Bowler" expanded={expandedRole === "Bowler"} onChange={() => handleAccordionChange("Bowler")}>
              <AccordionSummary  className={gClasses.whiteAccordian} key={"ASS"+"Bowler"} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={gClasses.patientInfo2}>{"Bowler ( " + allBowler.length + " player(s) )"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DisplayMyPlayers players={allBowler} />
              </ AccordionDetails>
            </Accordion>
            <Accordion key="AllRounder" expanded={expandedRole === "AllRounder"} onChange={() => handleAccordionChange("AllRounder")}>
              <AccordionSummary  className={gClasses.whiteAccordian} key={"ASS"+"AllRounder"} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={gClasses.patientInfo2}>{"AllRounder ( " + allAllRounder.length + " player(s) )"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DisplayMyPlayers players={allAllRounder} />
              </ AccordionDetails>
            </Accordion>              
            <Accordion  key="Wk" expanded={expandedRole === "Wk"} onChange={() => handleAccordionChange("Wk")}>
              <AccordionSummary  className={gClasses.whiteAccordian} key={"ASS"+"Wk"} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography className={gClasses.patientInfo2}>{"WK ( " + allWk.length + " player(s) )"}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <DisplayMyPlayers players={allWk} />
              </ AccordionDetails>
            </Accordion>              
        </div>
        );
    }

    async function handleMyBid(newBid) {
        var value = parseInt(newBid) + parseInt(bidAmount);
        let myURL=`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/nextbid/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}/${playerId}/${value}`;
        try {
            let xxx = axios.get(myURL);
            // await xxx;
            // console.log(`Bid for value ${newBid}`)
            // setBidAmount();
        } catch(e) {
            console.log("Bid by same user");
        }
    }

    function DisplayCurrentBidDetails(props) {
     //console.log(props.name, props.value);
    return (
    <Grid align="center"m={1} p={1} container justify="center" alignItems="center" >
			<GridItem xs={2} sm={2} md={3} lg={3} />
      <GridItem style={{backgroundColor: "#FFFFFF"}}  xs={8} sm={8} md={6} lg={6} >
        <Typography className={gClasses.info14Bold}  >Current Bid Amount: {props.value}</Typography>
        <Typography className={gClasses.info14Bold} >Bid by: {props.name}</Typography>
      </GridItem>
			<GridItem xs={2} sm={2} md={3} lg={3} />
    </Grid>
    )}
    
    function BidButton(props) {
			  if (!AuctionTableData.length) return null;
				if (!AuctionTableData[0].players)  AuctionTableData[0].players = [];
				if (!AuctionTableData[0].players) return null;
				
        let btnMsg, btnDisable, btnSize;
				btnDisable = AuctionTableData[0].players.length >= maxPlayers;
				//console.log(AuctionTableData[0].players.length);
				//console.log(maxPlayers);
        if (props.value === "AMOUNT") {
            // console.log(bidAmount);
            btnMsg = `Current Bid Amount:  ${bidAmount}`;
            btnDisable = true;
            btnSize = "medium";
        } else if (props.value === "NAME") {
            btnMsg = `Bid by :  ${bidUser}`;
            btnDisable = true;
            btnSize = "medium";
        } else {
            btnMsg = "+"+props.value;
            let newValue = parseInt(bidAmount) + parseInt(props.value);
            if (!btnDisable) btnDisable = ((newValue > parseInt(myBalanceAmount)) || (!interested) );
            //console.log(btnDisable);
            btnSize = "small";
        }
        if (btnDisable) {
            return (
            <Button variant="contained"  size={btnSize}
            className={classes.infoButton}
            disabled>
            {btnMsg}
            </Button>
            );
        } else {
            return (
            <Button variant="contained"  size={btnSize}
            className={classes.infoButton}
            onClick={() => { handleMyBid(props.value); }}>
            {btnMsg}
            </Button>
            );
        }
    }

    function ShowValueButtons() {
				//console.log("In show value", auctionStatus);
        if (auctionStatus === "RUNNING")
            return (
            <div>
            {/*<div align="center">
                    <BidButton value="AMOUNT"/>
                </div>
                <div align="center">
                    <BidButton value="NAME"/>
            </div>*/}
                <DisplayCurrentBidDetails  name={bidUser} value={bidAmount} />
                <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" >
								<GridItem xs={12} sm={12} md={12} lg={12} >
                    <br />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="5" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="10" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="15" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="20" />
                </GridItem>
								<GridItem xs={12} sm={12} md={12} lg={12} >
                    <br />
                </GridItem>
                </Grid>
                <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" >
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="25" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="50" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="75" />
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3} >
                    <BidButton value="100" />
                </GridItem>
                </Grid>
            </div>);
        else
            return(<div></div>);
    }

    function ShowAuctionOverButton() {
			if (localStorage.getItem("admin").toLowerCase() !== "true") return null;
			return(
			<div align="center">
				<Button variant="contained" color="primary" size="large" className={classes.button} onClick={handleAuctionOver}>
					AUCTION OVER
				</Button>
			</div>
			); 
    }


    function ShowAdminButtons() {
        // console.log("admin buttons")
        // console.log(localStorage.getItem("admin").toLowerCase());
        if (localStorage.getItem("admin").toLowerCase() === "true")
            return(
            <div align="center" key="playerAuctionButton">
						<br />
            <Grid className={classes.bidButton} m={1} p={1} container justify="center" alignItems="center" >
            <GridItem xs={2} sm={2} md={2} lg={2} />
            <GridItem xs={4} sm={4} md={4} lg={4} >
							{/*<Button
									variant="contained"
									color="primary"
									size="small"
									className={classes.button}
									// startIcon={<CheckSharpIcon />}
									disabled={((bidAmount === 0) || (bidPaused === true))}
									onClick={() => sellplayer(MAXCOUNTDOWN)}>
									SOLD
							</Button>*/}
							<VsButton name="Sold" disabled={((bidAmount === 0) || (bidPaused === true))} onClick={() => sellplayer(MAXCOUNTDOWN)} />
            </GridItem>
            <GridItem xs={4} sm={4} md={4} lg={4} >
							{/*<Button
									variant="contained"
									color="primary"
									size="small"
									className={classes.button}
									// startIcon={<ClearSharpIcon />}
									disabled={((bidAmount !== 0) || (bidPaused === true))}
									onClick={() => skipPlayer()}>
									UNSOLD
							</Button>*/}
							<VsButton name="Unsold" disabled={((bidAmount !== 0) || (bidPaused === true))} onClick={() => skipPlayer()} />
            </GridItem>
            <GridItem xs={2} sm={2} md={2} lg={2} />
            </Grid>
            </div>
            );
        else 
            return(<div></div>);
    }


    const startAuction = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setauctionstatus/${localStorage.getItem("gid")}/RUNNING`);
            //setAuctionStatus("RUNNING");
        } catch (err) {
            // should show the display
            // console.log("cannot start auction");
            // console.log(err.response.status);
            DisplayBidOverMsg("Insufficient members in Group.")
        }
    }

/*
      <Typography align="center" >
          <span className={gClasses.info18Brown} >{inPageData.length}/{totalMembers} members on Auction Page</span>
          <span><InfoIcon style={{color: 'blue', marginLeft: "5px" }} size="small" onClick={() => { setInfoDrawer("PENDING") } } /></span>
        </Typography>
      <br />
      */

   
  function DisplayPendingButton() {
    /* if current starting pending        */ 
    if (localStorage.getItem("admin") === "true")
    return ( 
      <div>   
        <Typography align="center" >
          <span className={gClasses.info18Brown} >{inPageData.length}/{totalMembers} members on Auction Page</span>
          <span><InfoIcon style={{color: 'blue', marginLeft: "5px" }} size="small" onClick={() => { setInfoDrawer("PENDING") } } /></span>
          </Typography>
        <br />      
        <DisplayPendingOver message="Auction can be started only after all members have joined."/>
        <VsButton name="Start Auction" disabled={false}  onClick={() => startAuction("PENDING")}/>
      </div>
    );
  else
      return <DisplayPendingOver message="Auction has not yet started"/>
  }
    
    function ShowJumpButtons() {
        // console.log("Status", auctionStatus)
        if (auctionStatus === "OVER") {
            return (
            <div>
                <BlankArea />
                <JumpButtonFull page={process.env.REACT_APP_CAPTAIN} text="Next (Captain)" />
            </div>
            )
        } else
            return null;
    }
    
    function DisplayPendingOver(props) {
        // console.log(props);
        return (
        <div>
            <Typography align="center" className={classes.noPlayerMsg}>
                {noPlayerMessage}
            </Typography>
            <Typography align="center">
                {props.message}
            </Typography>
        </div>
        );
    }

    function DisplayAuctionInformation() {
			// console.log(auctionStatus);
			if (hasGroup()) {
				// console.log("In has group");
				if ( auctionStatus === "PENDING") {
						return (
								<div align="center">
										{/* <DisplayPendingOver message="Auction has not yet started"/> */}
										<DisplayPendingButton/>
										<MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={playerStatus} />
								</div>);
				} 
				else if (auctionStatus === "OVER") {
						return (
								<div align="center">
										<DisplayPendingOver message="Auction is Over"/>
								</div>);
				} 
				else if (auctionStatus === "RUNNING") {
					return (
						<div align="center">
								<DisplayRunningAuction />
						</div>
							); 
				} else {
						return (<BlankArea/>);
        } 
			} 
			else
				return <NoGroup/>
    }

    /***
    function ModalShowCountDown() {
        return (
        <form>
          <Typography id="modalTitle" className={classes.modalTitle} align="center">Sell Count Down</Typography>
          <BlankArea />
          <p align="center" className={classes.modalMessage}>{countDown} seconds</p>
        </form>  
        )
    }
    ***/
    
    //console.log(infoDrawer);
    return (
		<div align="center">
			<DisplayPageHeader headerName="AUCTION" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
			<DisplayAuctionInformation/>
			{/* <div className={classes.modalContainer} >
					<Modal
					isOpen={modalIsOpen}
					onAfterOpen={afterOpenModal}
					onRequestClose={closeModal}
					style={modalStyles}
					contentLabel="Example Modal"
					aria-labelledby="modalTitle"
					aria-describedby="modalDescription"
					>
							<ModalShowCountDown />
					</Modal> */}
			{/* </div> */}
			<ShowJumpButtons />
			<BlankArea />
      <Drawer maxWidth="xs" anchor="right" variant="temporary" open={infoDrawer !== ""}>
      <Box className={gClasses.drawerStyle} borderColor="black" borderRadius={7} border={1} >
      <Container component="main" maxWidth="xs">
      <VsCancel align="right" onClick={() => { setInfoDrawer("")}} />	
      <br />
      <Typography align="center" className={gClasses.info18Blue}>{((infoDrawer === "RUNNING")) ? "Members not interested" : "Members in Auction Page"}</Typography>
      <br />
      <Table>
        < TableBody p={0}>
          {inPageData.map(item => {
          if (infoDrawer === "RUNNING") {
            if (item.interested) return null;
          }
          
          return (
            <TableRow align="left" key={item.uid}>
              <TableCell style={ {padding: "0px" } }  align="left" >
                <Typography className={gClasses.info18} >{item.userName}</Typography>
              </TableCell>
            </TableRow>
                )
          })}
        </TableBody> 
      </Table>
      </Container>
      </Box>
    </Drawer>
    {/*<Drawer anchor="top" variant="temporary" open={soldDrawer == "SOLD"} onRequestClose={() => setSoldDrawer("") } >
      <DisplayCancel onCancel={() => setSoldDrawer("")} />
      <ShowCountDown />
    </Drawer>*/}
    <Modal isOpen={soldDrawer == "SOLD"} onAfterOpen={afterOpenModal} onRequestClose={() => setSoldDrawer("")} style={modalStyles} contentLabel="Example Modal" ariaHideApp={false} >
      <DisplayCancel onCancel={() => setSoldDrawer("")} />
      <ShowCountDown />
    </Modal>    
    <Modal
				isOpen={modalIsOpen}
				onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={modalStyles}
				contentLabel="Example Modal"
				ariaHideApp={false} 
			>
				<VsCancel align="right" onClick={() => { closeModal() }} />
				<Typography className={gClasses.info18} align="center">Confirm Auction over</Typography>
				<BlankArea />
				<div align="center" >
				<VsButton name="Confirm" onClick={handleAuctionOverConfirm} />
				</div>
			</Modal>
		</div>
    );

 
}
