import React, { useEffect } from 'react';


/* 
import { createBrowserHistory } from "history";

*/

import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

/*
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
*/

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 
import {red, blue, green, deepOrange} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
/// cd items import
import Dash from "views/Dashboard/Dashboard"
//import Stats from "views/Statistics/Statistics"
import MyTeam from "views/MyTeam/MyTeam"
import Auction from "views/Auction/Auction"
import Captain from "views/Captain/Captain"
import Match from "views/UpcomingMatch/UpcomingMatch"
import Group from "views/Group/Group"
import AdminWallet from "views/Wallet/AdminWallet"
import Wallet from "views/Wallet/Wallet.js"
import Update from "views/UpgradeToPro/Update.js"
import AddWallet from "views/Wallet/AddWallet";
import WithdrawWallet from "views/Wallet/WithdrawWallet";
// import KycBank from "views/Wallet/KycBank";
// import KycDocs from "views/Wallet/KycDocs";

//import PlayerInfo from "views/APL/PlayerInfo";
import PlayerStat from "views/PlayerStat/PlayerStat";
// import Profile from "views/Profile/Profile.js"
import Profile from "views/Profile/UserProfile"
import ChangePassword from "views/Login/ChangePassword.js"
//import About from "views/APL/About.js";
import HowToPlay from "views/APL/HowToPlay.js";
import Home from "views/APL/Home.js";
import ContactUs from "views/APL/ContactUs.js";
import PointSystem from "views/APL/PointSystem.js";
import SU_Tournament from "views/SuperUser/Tournament.js" 
import SU_Player from "views/SuperUser/Player.js" 
import SU_Image from "views/SuperUser/Image.js" 
import NewGroup from "views/Group/NewGroup.js"
import JoinGroup from "views/Group/JoinGroup.js"
import GroupDetails from "views/Group/GroupDetails.js"
import Modal from 'react-modal';
// import download from 'js-file-downloader';
import { BlankArea } from './CustomComponents';
import {cdRefresh, specialSetPos, upGradeRequired, 
  downloadApk, clearBackupData,
  checkIdle, setIdle,
  internalToText, textToInternal,
} from "views/functions.js"
import { LocalSee } from '@material-ui/icons';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#000000',
    color                 : '#FFFFFF',
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  noSpacing: { 
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon : {
    color: '#FFFFFF',
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(2),
  },
  statButton: {
    //marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  teamButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  dashButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: '#FFFFFF'
  },
  whatIsNew: {
    backgroundColor: '#B3E5FC',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
    // width: theme.spacing(10),
    // height: theme.spacing(10),
  
  },
  avatar1: {
    margin: theme.spacing(0),
    backgroundColor: 'white',		//deepOrange[500],  //'#FFFFFF',
    color: 'black', 
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
  },
}));

export function setTab(num) {
  
  //myTabPosition = num;
  //console.log(`Menu pos ${num}`);
  localStorage.setItem("menuValue", num);
  cdRefresh();
}

export function CricDreamTabs() {
  const history = useHistory();
  const classes = useStyles();
  // for menu 
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // for group menu
  const [grpAuth, setGrpAuth] = React.useState(true);
  const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
  const grpOpen = Boolean(grpAnchorEl);
  const [arunGroup, setArunGroup] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);
  const [latestApk, setLatestApk] = React.useState(null);

  //console.log(location.pathname);

  useEffect(() => {       
    const checkVersion = async () => {
      //console.log("about to call upgrade");
      let upg = await upGradeRequired();
      // console.log(upg);
      if (upg.latest) setLatestApk(upg.latest);

      setUpgrade(upg.status);
      if (upg.status) setIsOpen(true);
    }
    function setMenuValue() {

      // check url
      let walletRouting = false;
      let x = location.pathname.split("/");
      if (x.length >= 3)
      if (x[1] === "apl")
      if (x[2] === "walletdetails") {
        walletRouting = true;
        // const { payment_id, payment_status,  payment_request_id} = useParams();
        //console.log("URLDATA", payment_id, payment_status, payment_request_id);
        let param = (x.length >= 4) ? x[3] : "";
        sessionStorage.setItem("payment_id", param)
        param = (x.length >= 5) ? x[4] : "";
        sessionStorage.setItem("payment_status", param)
        param = (x.length >= 6) ? x[5] : "";
        sessionStorage.setItem("payment_request_id", param)
      }
      
      if (walletRouting) {
        localStorage.setItem("menuValue", process.env.REACT_APP_WALLET);
        history.push("/");
      } else if (checkIdle()) {
        localStorage.setItem("menuValue", process.env.REACT_APP_HOME);
      } 
      setValue(parseInt(localStorage.getItem("menuValue")));
      setIdle(false);
    }
    // Version check is now done in Home component
    // if (value === parseInt(process.env.REACT_APP_HOME))
    //   checkVersion();  
    
    setMenuValue();

    // console.log("Params",
    //   sessionStorage.getItem("param1"),
    //   sessionStorage.getItem("param2"),
    //   sessionStorage.getItem("param3")
    // );

}, []);


  //console.log(`in Tab function  ${localStorage.getItem("menuValue")}`);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleGrpMenu(event) {
    setGrpAnchorEl(event.currentTarget);
    // console.log(event.currentTarget);
    var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`;
    axios.get(myUrl).then((response) => {
      let allGroups = response.data[0].groups;
      if (allGroups.length > 0) {
        let tmp = allGroups.find(x => x.defaultGroup == true);
        if (!tmp) {
          tmp = allGroups[0];
          tmp.defaultGroup = true;
          localStorage.setItem("gid", tmp.gid.toString());
          localStorage.setItem("groupName", tmp.groupName);
          localStorage.setItem("tournament", tmp.tournament);
          localStorage.setItem("admin", tmp.admin);
          // clearBackupData();
        }
      }
      setUserGroup(allGroups);
      // console.log('Everything is awesome.');
      setArunGroup(true);
    }).catch((error) => {
      //console.log('Not good man :(');
      console.log(error);
      setUserGroup([]);
      setArunGroup(true);
    })
  };

  async function handleGroupSelect(index) {
    setArunGroup(false);
    let gRec = userGroup[index];
    try {
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${gRec.gid}`);
      localStorage.setItem("gid", gRec.gid);
      localStorage.setItem("groupName", gRec.groupName);
      localStorage.setItem("tournament", gRec.tournament);
      localStorage.setItem("admin", gRec.admin);
      clearBackupData();
      cdRefresh();
    } catch (e) {
      console.log(e);
      console.log("error setting default group");
    }
  }
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGrpClose = () => {
    setGrpAnchorEl(null);
    setArunGroup(false);
  };

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    localStorage.setItem("menuValue", num);
  }

  const handleDash = () => { setMenuValue(1);  }
  const handleStat = () => { setMenuValue(2);  }
  const handleTeam = () => { setMenuValue(3);  }
  const handleHome = () => { setMenuValue(4);  }
  const handleMatch = () => { handleClose(); setMenuValue(101);}
  const handleAuction = () => { handleClose(); setMenuValue(102);}
  const handleCaptain = () => { handleClose(); setMenuValue(103);}
  const handleGroup = () => { handleGrpClose(); setMenuValue(104);}
  const handleWallet = () => { handleClose(); setMenuValue(105);}
  const handleProfile = () => { handleClose(); setMenuValue(106);}
  const handlePassword = () => { handleClose(); setMenuValue(107);}
  // 108 for add wallet
  const handleHelpDesk = () => { handleClose(); setMenuValue(201);}
  const handleContactUs = () => { handleClose(); setMenuValue(202);}
  const handlePointSystem = () => { handleClose(); setMenuValue(203);}

  const handleSuTournament = () => { handleClose(); setMenuValue(301);}
  const handleSuPlayer = () => { handleClose(); setMenuValue(302);}
  const handleSuImage = () => { handleClose(); setMenuValue(303);}

  const handleUpdate = () => { handleClose(); setMenuValue(304);}

  const handleGroupNew = () => { handleGrpClose(); setMenuValue(1001);}
  const handleGroupJoin = () => { handleGrpClose(); setMenuValue(1002);}
  const handleGroupDetails = () => { handleGrpClose(); setMenuValue(1003);}
  const handlePlayerStat = () => { handleGrpClose(); setMenuValue(1004);}
  const handleAdminWallet = () => { handleGrpClose(); setMenuValue(1005);}

  const handleLogout = () => {
    handleClose();
    localStorage.setItem("uid", "");
    //localStorage.setItem("menuValue", process.env.REACT_APP_DASHBOARD);
    cdRefresh();  
  };

  function Show_Supervisor_Options() {
    if (localStorage.getItem("userPlan") == process.env.REACT_APP_SUPERUSER) {  
      return (
        <div>
        <MenuItem onClick={handleSuTournament}>SU Tournament</MenuItem>
        <MenuItem onClick={handleSuPlayer}>SU Player</MenuItem>
        <MenuItem onClick={handleAdminWallet}>SU Wallet</MenuItem>
        {/* <MenuItem onClick={handleSuImage}>SU Load Image</MenuItem> */}
        <Divider />
        </div>)
    } else {
      return null;
    }
  }

  function DisplayCdItems() {
    switch(value) {
      case 1: return <Dash/>; 
      //case 2: return <Stats/>;			This has been replaced by Player Stat
      case 3: return <MyTeam />;
      case 4: return <Home />;
      case 101: return <Match />;
      case 102: return <Auction />;
      case 103: return <Captain />;
      case 104: return <Group />;
      case 105: return <Wallet />;
      case 106: return <Profile />;
      case 107: return <ChangePassword />;
      case 108: return <AddWallet />
      case 109: return <WithdrawWallet />
      // case 110: return <KycBank />;
      // case 111: return <KycDocs />
      case 201: return <HowToPlay />;
      case 202: return <ContactUs />;
      case 203: return <PointSystem />;
      case 301: return <SU_Tournament />;
      case 302: return <SU_Player />;
      case 303: return <SU_Image />;
      case 304: return <Update />;
      case 1001: return <NewGroup />;
      case 1002: return <JoinGroup />;
      case 1003: return <GroupDetails />;
      case 1004: return <PlayerStat />;
      case 1005: return <AdminWallet />;
      default: return  null;
    }
  }

  async function handleUpgrade() {
    //console.log("upgrade requested");
    closeModal();
    await downloadApk();
    console.log("APK has to be downloaded");
  }

  function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }

  function DisplayUpgrade() {
    //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
    if (upgrade)
      return(
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        {/* <Typography className={classes.new} align="center">
          Current Version {process.env.REACT_APP_VERSION}
        </Typography> */}
        <Typography className={classes.new} align="center">
          Latest Version {latestApk.version}
        </Typography>
        <BlankArea/>
        <Typography className={classes.new} align="center">
          What is new
        </Typography>
        <TextField variant="outlined" multiline fullWidth disabled
          id="producttext"
          // label="What is new" 
          className={classes.whatIsNew}
          defaultValue={latestApk.text} 
        />
        <BlankArea />
        <Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
        className={classes.dashButton} onClick={handleUpgrade}>Update Now
        </Button>
      </Modal>
      )
    else
      return(null);
  }

  function DisplayGroupMenu() {
    // console.log("Group length", userGroup.length);
    return (
      <div key="usergroups">
      {userGroup.map( (item, index) => {
        return (
        <MenuItem key={index} onClick={() => handleGroupSelect(index)}>{item.groupName}</MenuItem>
        )
      })}
      </div>
    );
  }
    
  let mylogo = `${process.env.PUBLIC_URL}/APLLOGO1.ICO`;
  let groupCharacter="G";
  let currencyChar = 'Pts';  //'₹';
  let myName = localStorage.getItem("userName");
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.noSpacing}>
          {auth && (
            <div>
						<MenuIcon className={classes.icon} onClick={handleMenu} />
              <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: 'top', horizontal: 'left', }}
                // keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right', }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleWallet}>Wallet</MenuItem>
                <Divider/>
                <Show_Supervisor_Options/>
                {/* <MenuItem onClick={handleHelpDesk}>How to play</MenuItem> */}
                <MenuItem onClick={handleContactUs}>Contact Us</MenuItem>                  
                {(process.env.REACT_APP_DEVICE === "APK") && 
                <div>
                  <Divider/>
                  <MenuItem onClick={handleUpdate}>Update</MenuItem>
                </div>
                }
                <Divider/>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
					<HomeIcon className={classes.icon} onClick={handleHome} />
          <Button color="inherit" className={classes.dashButton} onClick={handleDash}>DashBoard</Button>
          <Button color="inherit" className={classes.statButton} onClick={handlePlayerStat}>Stats</Button>
          <Button color="inherit" className={classes.teamButton} onClick={handleTeam}>Team</Button>
					<Avatar 
            aria-label="account of current user"
            aria-controls="user-appbar"
            aria-haspopup="true"
            onClick={handlePointSystem}
            color="inherit"
            variant="circular" className={classes.avatar1}>{currencyChar}
          </Avatar>
       </Toolbar>
      </AppBar>
      <DisplayCdItems/>
      {/* <DisplayUpgrade/> */}
    </div>
  );
}