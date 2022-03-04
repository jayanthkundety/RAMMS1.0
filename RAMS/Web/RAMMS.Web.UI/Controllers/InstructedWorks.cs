
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using RAMMS.Business.ServiceProvider;
using RAMMS.Business.ServiceProvider.Interfaces;
using RAMMS.DTO.ResponseBO;
using RAMMS.DTO.RequestBO;
using RAMMS.Web.UI.Models;
using System.IO;
using Microsoft.Extensions.Configuration;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;
using AutoMapper;
using RAMMS.DTO.Wrappers;
using X.PagedList;
using RAMMS.DTO.JQueryModel;

namespace RAMMS.Web.UI.Controllers
{

    public class InstructedWorks : Models.BaseController
    {
       

        public InstructedWorks()
        {
        }

        
        public IActionResult IWIndex()
        {
            return View();
        }


    }
}
