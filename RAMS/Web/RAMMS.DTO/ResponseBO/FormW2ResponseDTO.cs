﻿using System;
using System.Collections.Generic;
using System.Text;

namespace RAMMS.DTO.ResponseBO
{
    public class FormW2ResponseDTO
    {
        public int PkRefNo { get; set; }
        public string Fw1RefNo { get; set; }
        public string JkrRefNo { get; set; }
        public string SerProviderRefNo { get; set; }
        public DateTime? DateOfInitation { get; set; }
        public string Region { get; set; }
        public string Division { get; set; }
        public string Rmu { get; set; }
        public int? Attn { get; set; }
        public string ServiceProvider { get; set; }
        public string Cc { get; set; }
        public string RoadCode { get; set; }
        public string RoadName { get; set; }
        public int? FrmCh { get; set; }
        public int? ToCh { get; set; }
        public string TitleOfInstructWork { get; set; }
        public DateTime? DateOfCommencement { get; set; }
        public DateTime? DateOfComplition { get; set; }
        public decimal? InstructWorkDuration { get; set; }
        public string Remarks { get; set; }
        public string DetailsOfWorks { get; set; }
        public decimal? CeilingEstCost { get; set; }
        public bool? IssuedSignature { get; set; }
        public string IssuedName { get; set; }
        public DateTime? IssuedDate { get; set; }
        public bool? ReceivedSignature { get; set; }
        public string ReceivedName { get; set; }
        public DateTime? ReceivedDate { get; set; }
        public int? ModBy { get; set; }
        public DateTime? ModDt { get; set; }
        public int? CrBy { get; set; }
        public DateTime? CrDt { get; set; }
        public bool? SubmitSts { get; set; }
        public bool? ActiveYn { get; set; }
    }
}
